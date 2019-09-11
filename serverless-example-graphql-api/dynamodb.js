const AWS = require('aws-sdk');
const uuid = require('uuid');

let options = {};

if (process.env.IS_LOCAL) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
}

const dynamoDb = new AWS.DynamoDB.DocumentClient(options);

const promisify = foo => new Promise((resolve, reject) => {
  foo((error, result) => {
    if(error) {
      reject(error)
    } else {
      resolve(result)
    }
  })
});

const createOrder = async (data) => {
  data.id = uuid();
  return promisify(callback => {
    const params = {
      TableName: process.env.ORDER_TABLE_NAME,
      Item: {
        orderId: data.id,
        services: {
          SS: data.services
        },
        notes: {
          S: data.notes || ""
        },
        datetime: {
          S: data.datetime
        },
        addressFrom: {
          S: data.addressFrom
        },
        addressTo: {
          S: data.addressTo
        },
        phoneNumber: data.phoneNumber,
        email: {
          S: data.email
        },
        name: {
          S: data.name
        }
      }
    }
    dynamoDb.put(params, callback)
  }).then(() => data);
};

const updateOrder = async (id, data) => {
  return promisify(callback => {

    dynamoDb.update({
      TableName: process.env.ORDER_TABLE_NAME,
      Key: { orderId: id },
      UpdateExpression: "SET #S = :s, #N = :n, #D = :d, #AF = :af, #AT = :at",
      ExpressionAttributeValues: {
        ":s": {
          "SS": data.services
        },
        ":n": {
          "S": data.notes
        },
        ":d": {
          "S": data.datetime
        },
        ":af": {
          "S": data.addressFrom
        },
        ":at": {
          "S": data.addressTo
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
  }).then(() => ({ id, ...data }))
};

const getOrders = async (filter = {}) => {
  return promisify(callback => {
    const params = {
      TableName: process.env.ORDER_TABLE_NAME,
    };
    if (filter.phoneNumber) {
      params.IndexName = "phoneNumberIndex";
      params.KeyConditionExpression = "#p = :p";
      params.ExpressionAttributeNames = {
        "#p": "phoneNumber"
      };
      params.ExpressionAttributeValues = {
        ":p": filter.phoneNumber
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
  });
};

module.exports = {
  dynamoDb,
  createOrder,
  updateOrder,
  getOrders
};
