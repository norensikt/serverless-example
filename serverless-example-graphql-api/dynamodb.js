const AWS = require('aws-sdk');

let options = {};

if (process.env.IS_LOCAL) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
}

module.exports =  new AWS.DynamoDB.DocumentClient(options);
