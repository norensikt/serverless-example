const uuid = require('uuid');
const { dynamoDb, createOrder, updateOrder, getOrders, deleteOrder } = require('./dynamodb');

const promisify = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if(error) {
      reject(error)
    } else {
      resolve(result)
    }
  })
});

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    orders: (obj, args) => getOrders(args)
  },
  Mutation: {
    createOrder: (obj, { input }) => createOrder(input).then(result => {
        return {
          order: result
        }
      }),
    updateOrder: (obj, args) => updateOrder(args.id, args.input).then(result => {
      return {
        order: result
      }
    }),
    deleteOrder: (obj, args) => deleteOrder(args.id).then(result => {
      return {
        id: args.id
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

module.exports = resolvers;
