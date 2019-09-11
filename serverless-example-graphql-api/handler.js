'use strict';
const server = require('./graphql');

module.exports.graphql = server.createHandler({
  cors: {
    origin: '*', // TODO: Restrict who can access the API, would be great if we can take the website domain as a variable
    credentials: true,
  }
});
