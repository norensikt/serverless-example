'use strict';
const { ApolloServer, gql } = require('apollo-server-lambda');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  
  scalar DateTime
  
  enum OrderStatus {
      NEW
      COMPLETED
      DELETED
  } 
  
  enum Service {
      MOVING
      PACKING
      CLEANING
  }
  
  interface Node {
      id: ID!
  }
  
  type Customer implements Node {
      id: ID!
      phoneNumber: String!
      email: String! # TODO: Create custom type for validation purposes
      name: String!
  }
  
  type Order implements Node {
      id: ID!
      customer: Customer!
      services: [Service!]
      notes: String
      datetime: DateTime!
      addressFrom: String!
      addressTo: String!
  }
  
    type Query {
        orders(id: ID): [Order!]
    }
  
  input CreateOrderInput {
      phoneNumber: String!
      email: String!
      name: String!
      
      services: [Service]!
      notes: String
      datetime: DateTime!
      addressFrom: String!
      addressTo: String!
  } 
  
  type CreateOrderPayload {
    order: Order!
  }
  
  type Mutation {
      createOrder(input: CreateOrderInput!): CreateOrderPayload
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    orders: () => [],
  },
  Mutation: {
    createOrder: (input) => null
  },
  Node: {
    __resolveType(node) {
      // TODO: Should be a better way to figure out which object is what rather than checking for one of the fields
      if (obj.email) {
        return 'Customer'
      }

      if (obj.notes) {
        return 'Order'
      }
      return null
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // the `playground` and `introspection` options must be set explicitly to `true`.
  playground: true,
  introspection: true,
});

module.exports.graphql = server.createHandler({
  cors: {
    origin: '*', // TODO: Restrict who can access the API, would be great if we can take the website domain as a variable
    credentials: true,
  }
});
