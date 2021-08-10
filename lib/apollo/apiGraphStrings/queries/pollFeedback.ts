import { gql } from "@apollo/client";

const pollFeedBackQueries = {
  GET_ANSWERS_BY_POLL: gql`
    query AnswersByPoll($pollId: String!) {
      answersByPoll(pollId: $pollId) {
        _id
        answer
        creator {
          _id
          appid
        }
        answerImages
        creationDate
        likes {
          _id
          userId
          like
        }
        dislikes {
          _id
          userId
          dislike
        }
        rank
      }
    }
  `,
  IS_FAVORITE: gql`
    query IsFavorite($favType: String!, $favId: String!) {
      isFavorite(favType: $favType, favId: $favId)
    }
  `,
  GET_POLL_CHATS: gql`
    query MessagesByPoll($pollId: String!) {
      messagesByPoll(pollId: $pollId) {
        _id
        message
        creator {
          _id
          appid
          profilePic
        }
        creationDate
        poll {
          _id
        }
      }
    }
  `,
};

export default pollFeedBackQueries;