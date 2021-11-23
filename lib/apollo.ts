import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  NormalizedCacheObject,
  ApolloLink,
  OperationVariables,
  split,
  HttpLink,
  InMemoryCacheConfig,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { useMemo } from "react";
import { WebSocketLink } from "@apollo/client/link/ws";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import { getMainDefinition } from "@apollo/client/utilities";
// import { ApolloLink } from "apollo-link";
//Test
let cookie: any = Cookies.get("polditSession");

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;
let appToken: String | null = cookie ? cookie : null;
let appCookie: any | null = cookie ? cookie : null;
let isDev =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? true
    : false;

let decoded: any;
if (appCookie) {
  decoded = jwt_decode(cookie);
}
Cookies.set("userId", decoded?.id ? decoded?.id : "");

// const {
//   NEXT_PUBLIC_WS_API_DEV,
//   NEXT_PUBLIC_WS_API_PROD,
//   NEXT_PUBLIC_HTTP_API_DEV,
//   NEXT_PUBLIC_HTTP_API_PROD,
// } = process.env;
// let cookie: any = Cookies.get("polditSession"); ;
export const storeTokens = (
  sessionToken: String = "",
  sessionCookie: String = ""
) => {
  appToken = cookie;
  appCookie = cookie;
  return;
};
// console.log("appCookie is => ", appCookie);
// console.log("appToken is => ", appToken);

const wsLink = process.browser
  ? new WebSocketLink({
      // uri: 'ws://localhost:8080/graphql',
      uri: isDev
        ? (process.env.NEXT_PUBLIC_WS_API_DEV as string)
        : (process.env.NEXT_PUBLIC_WS_API_PROD as string),
      options: {
        reconnect: true,
        // lazy: true,
      },
    })
  : null;

const httpLink = new HttpLink({
  uri: isDev
    ? process.env.NEXT_PUBLIC_HTTP_API_DEV
    : process.env.NEXT_PUBLIC_HTTP_API_PROD,
  credentials: "same-origin",
});

const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

const errorLink = onError(
  ({ graphQLErrors, networkError, response, operation }) => {
    // response && response.errors == null
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }
  }
);

const authLink = setContext((request, previousContext) => {
  return {
    headers: {
      ...previousContext.headers,
      cookie: appCookie ? appCookie : "",
      authorization: appToken ? `Bearer ${appToken}` : "",
    },
  };
});

const cacheOptions: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        messagesByPoll: {
          merge: false,
        },
        answersByPoll: {
          merge: false,
        },
        subTopicsPerTopic: {
          merge: false,
        },
      },
    },
    Answer: {
      fields: {
        likes: {
          merge: false,
        },
        dislikes: {
          merge: false,
        },
      },
    },
    User: {
      fields: {
        following: {
          merge: false,
        },
      },
    },
    PollQuestion: {
      fields: {
        creationDate: {
          merge: false,
        },
      },
    },
  },
};

function createApolloClient() {
  return new ApolloClient({
    // ssrMode: typeof window === "undefined",
    link: ApolloLink.from([authLink, errorLink, splitLink]),
    cache: new InMemoryCache(cacheOptions),
  });
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    // get existing cache, loaded during client side data
    const existingCache = _apolloClient.extract();
    //restore cache using the data passed from getStaticProps/getServerSideProps combined with existing cache data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  //For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  //Create Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
