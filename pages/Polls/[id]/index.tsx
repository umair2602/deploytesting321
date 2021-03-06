import React, { useEffect, useState } from "react";
import GraphResolvers from "../../../lib/apollo/apiGraphStrings";
import {
  Answer,
  ChatUser,
  PollHistory,
  SelectedImage,
  User,
} from "../../../components/appTypes/appType";
import PollQuestion from "../../../components/pageComponents/Poll/pollQuestion";
import { useMutation, useQuery } from "@apollo/client";
import { ErrorToast } from "../../../components/pageComponents/Other/Error/Toast";
import { saveImgtoCloud } from "../../../components/apis/imgUpload";
import { updateViewCount } from "../../../lib/apollo/apolloFunctions/mutations";
import AnsBox from "../../../components/pageComponents/Poll/AnsBox/AnsBox";
import {
  Badge,
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import ChatTab from "../../../components/pageComponents/Poll/ChatBox/ChatTab";
import { UserTab } from "../../../components/pageComponents/Poll/UserTab/UserTab";
import { useRouter } from "next/router";
import { useAuth } from "_components/authProvider/authProvider";
import Layout from "_components/layout/Layout";
import { numCountDisplay } from "_components/formFuncs/miscFuncs";
import appStyles from "_appStyles/appStyles.module.css";
const { GET_POLL, GET_USER_FOR_POLL } = GraphResolvers.queries;

const Poll = () => {
  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();
  //States
  const [error, updateError] = useState<string[]>([]);

  const pollId = router.query.id;

  const flexObj = {
    flex: {
      base: "0 0 100%",
      lg: "0 0 50%",
    },
    maxW: { base: "100%", lg: "50%" },
    justifyContent: "center",
  };

  const { data } = useQuery(GET_POLL, {
    variables: { pollId },
  });

  const {
    data: answerData,
    loading,
    error: answerError,
    subscribeToMore,
  } = useQuery(GraphResolvers.queries.GET_ANSWERS_BY_POLL, {
    variables: { pollId },
  });

  const {
    data: userList,
    loading: userListLoading,
    error: userListError,
    subscribeToMore: userSubscribe,
  } = useQuery(GraphResolvers.queries.GET_POLL_CHAT_USERS, {
    variables: { pollId },
  });

  const { data: user } = useQuery(GET_USER_FOR_POLL);

  const [addAnswerToPolls] = useMutation(
    GraphResolvers.mutations.CREATE_ANSWER,
    {
      onError: (e) => addError(e.message),
    }
  );

  const [addView] = useMutation(GraphResolvers.mutations.ADD_VIEW);
  const [removeUserFromChat] = useMutation(
    GraphResolvers.mutations.REMOVE_CHAT_USER
  );

  // //Component Mounted

  useEffect(() => {
    updateViewCount(addView, pollId);
  }, []);

  useEffect(() => {
    subscribeToMore({
      document: GraphResolvers.subscriptions.ANSWER_SUBSCRIPTION,
      variables: { pollId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newAnswerItem = subscriptionData.data.newAnswer;
        const answerMatchIdx: number = prev?.answersByPoll.findIndex(
          (item: Answer) => item._id === newAnswerItem._id
        );
        if (answerMatchIdx > -1) {
          //Answer already exists.  This is for likes and dislikes count update without adding new answer
          const updatedAnswersByPoll = prev.answersByPoll.map(
            (item: Answer, idx: number) => {
              if (idx === answerMatchIdx) {
                return newAnswerItem;
              } else return item;
            }
          );

          if (newAnswerItem.poll._id === pollId) {
            return Object.assign({}, prev, {
              answersByPoll: updatedAnswersByPoll,
            });
          }

          return prev;
        }

        if (newAnswerItem.poll._id === pollId) {
          return Object.assign({}, prev, {
            answersByPoll: [...prev.answersByPoll, newAnswerItem],
          });
        }
        return prev;
      },
    });
  }, []);

  const subScribeHandler_userList = () => {
    userSubscribe({
      document: GraphResolvers.subscriptions.POLL_CHAT_USER_SUBSCRIPTION,
      variables: { pollId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        const newUser: ChatUser = subscriptionData?.data?.newChatUser;

        if (newUser && newUser.remove) {
          const updatedList = prev?.pollChatUsers.filter(
            (item: { id: string }) => item.id !== newUser.id
          );

          return { pollChatUsers: updatedList };
        }

        const prevMatch = prev?.pollChatUsers.some(
          (item: ChatUser) =>
            item.id === newUser.id && item.pollId === newUser.pollId
        );

        if (prevMatch || newUser.pollId !== pollId) {
          return prev;
        }

        return { pollChatUsers: [...prev.pollChatUsers, newUser] };
      },
    });
  };

  useEffect(() => {
    subScribeHandler_userList();

    return () => {
      const appUser = auth?.authState?.getUserData._id;

      appUser &&
        pollId &&
        removeUserFromChat({
          variables: { userId: appUser, pollId },
        });
      subScribeHandler_userList();
    };
  }, []);

  // //Functions

  const addError = (errMssg?: string) => {
    if (errMssg) {
      updateError([...error, errMssg]);
    } else updateError([]);
  };

  const removeError = (errId: number) => {
    let udpatedErrorList: string[] = [];
    if (error.length > 1) {
      udpatedErrorList = error.filter((item, idx) => errId === idx);
    } else {
      udpatedErrorList = [];
    }

    updateError(udpatedErrorList);
  };

  const addAnswer = async (
    answer: string,
    answerImage: SelectedImage | string
  ) => {
    if (data) {
      let imgId: string | null = null;

      const answerObj: any = {
        answer,
        poll: data?.poll?._id,
        multichoice: [],
        // answerImage: imgId && imgId,
      };

      if (answerImage && typeof answerImage !== "string") {
        imgId = await saveImgtoCloud(answerImage);
        answerObj["answerImage"] = imgId;
      } else answerObj["answerImage"] = "";

      addAnswerToPolls({ variables: { details: JSON.stringify(answerObj) } });
    }
  };

  if (data) {
    return (
      <Layout pageTitle={`Poll`}>
        <div style={{ marginTop: "20px" }}>
          <PollQuestion pollData={data.poll} />
          {error && (
            <ErrorToast
              mssgs={error}
              mssgType={"Poll Answer Error"}
              removeError={removeError}
            />
          )}
          <Flex wrap="wrap" pb={6} px={[0, 0, 20, 20, 36]}>
            <Box {...flexObj} p={4}>
              <AnsBox
                answers={answerData?.answersByPoll}
                loading={loading}
                addAnswer={addAnswer}
                pollId={data.poll._id}
                pollType={data.poll.pollType}
                error={answerError}
              />
            </Box>
            <Box {...flexObj} p={4}>
              <Box
                bg="white"
                pt={6}
                minW="350px"
                boxShadow="0 1px 10px -1px rgba(0,0,0,.2)"
              >
                <Tabs isFitted>
                  <TabList>
                    <Tab
                      _focus={{ outline: "none" }}
                      fontWeight="bold"
                      _selected={{
                        color: "poldit.100",
                        borderBottom: "2px solid",
                      }}
                      fontSize={["sm", "sm", "md"]}
                    >
                      Chat
                    </Tab>
                    <Tab
                      _focus={{ outline: "none" }}
                      fontWeight="bold"
                      _selected={{
                        color: "poldit.100",
                        borderBottom: "2px solid",
                      }}
                      fontSize={["sm", "sm", "md"]}
                    >
                      User List
                      <Badge
                        bgColor="green.300"
                        variant="solid"
                        borderRadius={"md"}
                        fontSize="0.78em"
                        color={"white"}
                        ml="3"
                        pl="2"
                        pr="2"
                      >
                        {userList?.pollChatUsers.length > 0 &&
                          numCountDisplay(userList?.pollChatUsers.length)}
                      </Badge>
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel bg="white" p="1px" maxH="">
                      <ChatTab
                        pollId={data.poll._id}
                        user={user && user?.getUserDataForPoll}
                        addAnswer={addAnswer}
                        pollType={data?.poll?.pollType}
                      />
                    </TabPanel>
                    <TabPanel bg="white" p="1px" height="868px">
                      <UserTab
                        data={userList?.pollChatUsers}
                        loading={userListLoading}
                        error={userListError}
                        appUser={auth?.authState?.getUserData?._id}
                        pollId={pollId}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Box>
          </Flex>
        </div>
      </Layout>
    );
  }

  return <div>Loading...</div>;
};

export default Poll;

export async function getServerSideProps(ctx: any) {
  return { props: {} };
}
