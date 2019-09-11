import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import AddOrder from "./CreateOrderFormContainer";

const OrderFormModal = (props) => (
  <Modal open={props.open}>
    <Modal.Header>Create an order</Modal.Header>
    <Modal.Content>
      <AddOrder onSuccess={props.onSuccess} order={props.order}/>
      <Button onClick={props.onSuccess}>Cancel</Button>
    </Modal.Content>
  </Modal>
);

export default OrderFormModal;
