'use strict';
const { ApolloServer, gql } = require('apollo-server-lambda');
const uuid = require('uuid');
const dynamoDb = require('./dynamodb');

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
  
  type Mutation {
      createOrder(input: CreateOrderInput!): CreateOrderPayload
      updateOrder(id: String!, input: CreateOrderInput!): CreateOrderPayload
  }
`;

const promisify = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if(error) {
      reject(error)
    } else {
      resolve(result)
    }
  })
})

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    orders: (obj, args, context, info) => promisify(callback => {
        const params = {
        TableName: process.env.ORDER_TABLE_NAME,
      };
      if (args.phoneNumber) {
        params.IndexName = "phoneNumberIndex";
        params.KeyConditionExpression = "#p = :p";
        params.ExpressionAttributeNames = {
          "#p": "phoneNumber"
        };
        params.ExpressionAttributeValues = {
          ":p": args.phoneNumber
        };
        params.Select = "ALL_ATTRIBUTES";
        dynamoDb.query(params, callback)
      } else {
        dynamoDb.scan(params, callback)
      }
    }).then(result => {
      return result.Items.map(item => ({
        datetime: item.datetime.S,
        notes: item.notes.S,
        phoneNumber: item.phoneNumber,
        name: item.name.S,
        email: item.email.S,
        services: item.services.SS,
        addressFrom: item.addressFrom.S,
        addressTo: item.addressTo.S,
        id: item.orderId
      }));
    }),
  },
  Mutation: {
    createOrder: (parent, { input }) => {
      input.id = uuid();
      return promisify(callback =>
      {
        const params = {
          TableName: process.env.ORDER_TABLE_NAME,
          Item: {
            orderId: input.id,
            services: {
              SS: input.services
            },
            notes: {
              S: input.notes || ""
            },
            datetime: {
              S: input.datetime
            },
            addressFrom: {
              S: input.addressFrom
            },
            addressTo: {
              S: input.addressTo
            },
            phoneNumber: input.phoneNumber,
            email: {
              S: input.email
            },
            name: {
              S: input.name
            }
          }
        }
        console.log('----------')
        console.log(input, params)
        dynamoDb.put(params, callback)
    }).then(result => {
      // TODO: Get inserted item from dynamodb
      return {
        order: input
      }
    })},
    updateOrder: (obj, args) => promisify(callback => {

      const { id, input } = args;

      dynamoDb.update({
        TableName: process.env.ORDER_TABLE_NAME,
        Key: { orderId: id },
        UpdateExpression: "SET #S = :s, #N = :n, #D = :d, #AF = :af, #AT = :at",
        ExpressionAttributeValues: {
          ":s": {
            "SS": input.services
          },
          ":n": {
            "S": input.notes
          },
          ":d": {
            "S": input.datetime
          },
          ":af": {
            "S": input.addressFrom
          },
          ":at": {
            "S": input.addressTo
          }
        },
        ExpressionAttributeNames: {
          "#S": "services",
          "#N": "notes",
          "#D": "datetime",
          "#AF": "addressFrom",
          "#AT": "addressTo"
        }
      }, callback)
    }).then(result => {
      return {
        order: {
          ...args.input,
          id: args.id
        }
      }
    })
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
