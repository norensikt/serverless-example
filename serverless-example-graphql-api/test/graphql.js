'use strict';

// tests for graphql
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('graphql', '/handler.js', 'graphql');
const orderListQueryEvent = require('./orderListQuery');
const createOrderMutationEvent = require('./createOrderMutation');
const updateOrderMutationEvent = require('./updateOrderMutation');
const findOrderByPhoneNumberQueryEvent = require('./findOrderByPhoneNumberQuery');

const replaceIdInMutation = (mutationQueryEvent, id) => {
  mutationQueryEvent.body = mutationQueryEvent.body.replace('REPLACE_ME_WITH_REAL_ID', id)
  return mutationQueryEvent
}

describe('graphql', () => {
  before((done) => {
    done();
  });

  // TODO: Other tests should not be depending on each other, possible solution, add initial data to local dynamodb and use that dataset in individual tests
  let createdItem = null;

  // TODO: Should verify that data sent in mutation is what is returned
  it('create order mutation should return successfully', () => {
    return wrapped.run(createOrderMutationEvent).then((response) => {
      // console.log(response)
      expect(JSON.parse(response.body)).to.not.property('errors');
      expect(response.statusCode).to.equal(200);
      createdItem = JSON.parse(response.body).data.createOrder.order;
    });
  });

  it('list orders query should return successfully', () => {
    return wrapped.run(orderListQueryEvent).then((response) => {
      // console.log(response)
      expect(JSON.parse(response.body)).to.not.property('errors');
      expect(response.statusCode).to.equal(200);
    });
  });

  it('update order mutation should return successfully', () => {
    return wrapped.run(replaceIdInMutation(updateOrderMutationEvent, createdItem.id)).then((response) => {
      // console.log(response)
      expect(JSON.parse(response.body)).to.not.property('errors')
      expect(response.statusCode).to.equal(200);
    });
  })

  it('find order by phone number query should return successfully', () => {
    return wrapped.run(findOrderByPhoneNumberQueryEvent).then((response) => {
      // console.log(response)
      expect(JSON.parse(response.body)).to.not.property('errors')
      expect(response.statusCode).to.equal(200);
    });
  });
});
