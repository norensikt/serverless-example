import React, { useState } from 'react';
import {graphql, useQuery} from 'react-apollo';
import { client } from '../index';
import { gql } from "apollo-boost";
import CreateOrderForm from "./CreateOrderForm";
import {useMutation} from "@apollo/react-hooks";
import OrderTable, {DELETE_ORDER} from "./OrderTable";

export const ADD_ORDER = gql`
  mutation AddOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
          order {
              id
              name
              phoneNumber
              email
              addressFrom
              addressTo
              datetime
              notes
              services
          }
      }
  }
`;

export const GET_ORDERS = gql`
  query getOrders {
      orders {
          id
          name
          phoneNumber
          email
          addressFrom
          addressTo
          datetime
          notes
          services
      }
  }
`;

export const UPDATE_ORDER = gql`
    mutation UpdateOrder($id: String!, $input: CreateOrderInput!) {
        updateOrder(id: $id, input: $input) {
            order {
                id
                name
                phoneNumber
                email
                addressFrom
                addressTo
                datetime
                notes
                services
            }
        }
    }
`;

const AddOrder = (props) => {

  const [order, setOrder] = useState(props.order || {
    name: "My Name",
    email: "test@test.com",
    phoneNumber: "90585987",
    addressFrom: "Address From",
    addressTo: "Address To",
    datetime: "2019-09-04T12:00",
    notes: "Notes from sales rep",
    services: ["MOVING", "CLEANING", "PACKING"]
  });

  const [updateOrder] = useMutation(UPDATE_ORDER, {
    onCompleted(data) {
      props.onSuccess()
    }
  })

  const [addOrder, { loading: mutationLoading, error: mutationError, data }] = useMutation(ADD_ORDER, {
    update(cache, { data: { createOrder } }) {
      const { orders } = cache.readQuery({ query: GET_ORDERS });
      cache.writeQuery({
        query: GET_ORDERS,
        data: { orders: [createOrder.order].concat(orders) }
      });
      setOrder({
        name: "",
        email: "",
        phoneNumber: "",
        addressFrom: "",
        addressTo: "",
        datetime: "",
        notes: "",
        services: []
      });
      props.onSuccess()
    }
  });

  if (mutationError) return <p>Error</p>;

  return (
    <CreateOrderForm order={order} isLoading={mutationLoading} isSuccess={true} handleSubmit={ order => {
      if (order.id) {
        let input = Object.assign({}, order)
        delete input.id
        delete input.__typename
        updateOrder({ variables: { id: order.id, input }});
      } else {
        addOrder({ variables: { input: order }});
      }
    }} />
  )
};

export const ListOrder = (props) => {
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_ORDERS);
  const [deleteOrder] = useMutation(DELETE_ORDER/*, {
    update(cache, { data: { deleteOrder }}) {
      const { orders } = cache.readQuery({ query: GET_ORDERS });
      cache.writeQuery({
        query: GET_ORDERS,
        data: { orders: orders.filter(order => order.id = deleteOrder.id )}
      })
    }
  }*/);

  if (queryError) return <p>Error...</p>;

  return <OrderTable handleRowClicked={props.handleRowClicked}  handleDelete={id => deleteOrder({ variables: { id }})} isLoading={queryLoading} orders={data && data.orders || []} />
};

export default AddOrder;
