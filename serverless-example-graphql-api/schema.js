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

        phoneNumber: String!
        email: String!
        name: String!
    }

    type Query {
        orders(phoneNumber: String): [Order!]
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
    
    type DeleteOrderPayload {
        id: String!
    }

    type Mutation {
        createOrder(input: CreateOrderInput!): CreateOrderPayload
        updateOrder(id: String!, input: CreateOrderInput!): CreateOrderPayload
        deleteOrder(id: String!): DeleteOrderPayload
    }
`;

module.exports = typeDefs;
