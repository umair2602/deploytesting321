const { gql } = require("apollo-server-micro");

module.exports = gql`
  type User {
    _id: ID!
    firstname: String
    lastname: String
    userId: String!
    email: String!
    password: String
    address1: String
    address2: String
    city: String
    state: String
    zipCode: String
    profilePic: String
    registerDate: String
    pollHistory: [PollQuestion!]
  }

  type AuthData {
    appToken: String!
    user: User!
  }

  extend type Query {
    users: [User]!
    getUserData: AuthData!
    logout: String
  }

  extend type Mutation {
    login(credentials: String!): String!
    refreshUserToken(userId: ID!): String!
  }
`;