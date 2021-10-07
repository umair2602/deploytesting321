import userQueries from "./user";
import pollQueries from "./poll";
import otherQueries from "./other";
import topicQueries from "./topics";
import pollFeedBackQueries from "./pollFeedback";
import internalUserQueries from "./internalUser";
import privilegeQueries from "./privilegesQueries";

export default {
  ...userQueries,
  ...pollQueries,
  ...topicQueries,
  ...pollFeedBackQueries,
  ...otherQueries,
  ...internalUserQueries,
  ...privilegeQueries,
};
