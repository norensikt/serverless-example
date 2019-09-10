'use strict';

// tests for graphql
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('graphql', '/handler.js', 'graphql');
const helloQueryEvent = require('./helloQuery');

describe('graphql', () => {
  before((done) => {
    done();
  });

  it('hello query should return successfully', () => {
    return wrapped.run(helloQueryEvent).then((response) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
