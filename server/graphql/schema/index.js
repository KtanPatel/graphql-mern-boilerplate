const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type ProfileData {
  firstName: String
  lastName: String
  gender: String
  phone: Int
  picture: String
}

type User {
  email: String
  role: String
  profile: ProfileData
}

interface responseData {
  success: Boolean
  message: String
}

type tokens {
  accessToken: String
  refreshToken: String
}

type response implements responseData {
  success: Boolean
  message: String
}

type loginRes implements responseData {
  success: Boolean
  message: String
  data: tokens
}

type userRes implements responseData {
  success: Boolean
  message: String
  data: User
}

type paginationResp {
  data: [User]
  totalRecords: Int
  start: Int
  pageSize: Int
}

type userList implements responseData {
  success: Boolean!
  message: String!
  data: paginationResp
}

input UserInput {
  email: String!
  password: String!
  role: String
}

input searchInput {
  start: Int
  pageSize: Int
  sortBy: String
  search: String
  filter: String
}

enum roles {
  admin
  user
}

type RootQuery {
  login(email: String!, password: String!): loginRes! 
  profile(id: String): userRes
  users(options: searchInput): userList!
}

type RootMutation {
  register(user: UserInput): response!
}

schema {
  query: RootQuery
  mutation: RootMutation
}

`);