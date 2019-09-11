import React, { useState } from 'react';
import {Button, Form, Divider, Segment, Header, Message} from 'semantic-ui-react';

// TODO: Fill this based on SERVICE enum in graphql schema.
const options = [{
  key: "MOVING", text: "Moving", value: "MOVING",
}, {
  key: "PACKING", text: "Packing", value: "PACKING",
}, {
  key: "CLEANING", text: "Cleaning", value: "CLEANING",
}];

const CreateOrderForm = (props) => {
  const [order, setOrder] = useState(props.order)
  const handleChange = (e, {name, value}) => setOrder({...order, [name]: value});
  return (
    <Segment loading={props.isLoading}>

      <Form onSubmit={(e) => { e.preventDefault(); props.handleSubmit(order)}} success={props.isSuccess}>

        <Header as="h3">Customer Information</Header>

        <Form.Input type="hidden" value={order.id} name="id" onChange={handleChange} />
        <Form.Input label="Customer Name" placeholder="Full Name" required value={order.name} name="name" onChange={handleChange} disabled={!!order.id} />
        <Form.Input label="Customer Email" placeholder="Email" required type="email" value={order.email} name="email" onChange={handleChange} disabled={!!order.id} />
        <Form.Input label="Customer Phone Number" placeholder="Phone Number" required type="tel" value={order.phoneNumber} name="phoneNumber" onChange={handleChange} disabled={!!order.id} />

        <Header as="h3">Order Information</Header>

        <Form.Dropdown label="Services" placeholder="One ore more services to perform" required fluid multiple selection options={options} value={order.services} name="services" onChange={handleChange} />
        <Form.Input label="Address From" placeholder="Address customer is moving from" required value={order.addressFrom} name="addressFrom" onChange={handleChange} />
        <Form.Input label="Address To" placeholder="Address customer is moving to" required value={order.addressTo} name="addressTo" onChange={handleChange} />
        <Form.Input label="Time" placeholder="Date when order should be performed" required value={order.datetime} type="datetime-local" name="datetime" onChange={handleChange} />
        <Form.TextArea label="Notes" placeholder="Notes related to this order" required value={order.notes} name="notes" onChange={handleChange} />
        <Button type="submit">Submit</Button>
      </Form>
    </Segment>
  );
}

export default CreateOrderForm;
