import { userTypeDefs } from "./user";
import { pollTypeDefs } from "./poll";
import { topicTypeDefs } from "./topic";
import { chatTypeDefs } from "./chat";
import { otherTypeDefs } from "./other";
import { rootTypeDefs } from "./root";
import { internalUserTypeDefs } from "./internalUsers";

const typeDefs = [
  rootTypeDefs,
  userTypeDefs,
  pollTypeDefs,
  topicTypeDefs,
  chatTypeDefs,
  otherTypeDefs,
  internalUserTypeDefs,
];

export default typeDefs;
