import React, { useState } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { gql } from 'apollo-boost';
import {useMutation} from "@apollo/react-hooks";
import {GET_ORDERS} from "./CreateOrderFormContainer";

export const DELETE_ORDER = gql`
    mutation DeleteOrder($id: String!) {
        deleteOrder(id: $id) {
            id
        }
    }
`;

const OrderTable = (props) => {
  const [active, setActive] = useState();
  const [deletedOrders, setDeletedOrders] = useState({});

  return (
    <Table selectable striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Ordre Id</Table.HeaderCell>
          <Table.HeaderCell>Customer Name</Table.HeaderCell>
          <Table.HeaderCell>Customer Email</Table.HeaderCell>
          <Table.HeaderCell>Customer Number</Table.HeaderCell>
          <Table.HeaderCell>Address From</Table.HeaderCell>
          <Table.HeaderCell>Address To</Table.HeaderCell>
          <Table.HeaderCell>Time</Table.HeaderCell>
          <Table.HeaderCell>Services</Table.HeaderCell>
          <Table.HeaderCell>Notes</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        { props.orders.map( order => (
          <Table.Row key={order.id} onClick={() => {
            setActive(order.id);}} active={order.id === active} hidden={deletedOrders[order.id]}>
            <Table.Cell>{order.id}</Table.Cell>
            <Table.Cell>{order.name}</Table.Cell>
            <Table.Cell>{order.email}</Table.Cell>
            <Table.Cell>{order.phoneNumber}</Table.Cell>
            <Table.Cell>{order.addressFrom}</Table.Cell>
            <Table.Cell>{order.addressTo}</Table.Cell>
            <Table.Cell>{order.datetime}</Table.Cell>
            <Table.Cell>{order.services.map(value => <div>{value}</div>)}</Table.Cell>
            <Table.Cell>{order.notes}</Table.Cell>
            <Table.Cell><Button onClick={e => {
              e.preventDefault();
              if (props.handleRowClicked) {
                props.handleRowClicked(order)
              }
            }}>Edit</Button><Button onClick={e => {
              e.preventDefault();
              setDeletedOrders({ ...deletedOrders, [order.id]: true });
              props.handleDelete(order.id);
            }}>Delete</Button></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default OrderTable
