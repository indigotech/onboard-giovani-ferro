export const typeDefs = `
  type Address {
    id: Int!
    cep: String!
    street: String!
    streetNumber: String!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
  }

  type User {
    id: Int!
    name: String!
    email: String!
    birthDate: String!
    addresses: [Address!]!
  }

  input AddressInput {
    cep: String!
    street: String!
    streetNumber: String!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
    addresses: [AddressInput!]!
  }

  type Query {
    user(id: Int!): User
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
  }
`;
