import React, { useState } from 'react';
import logo from './logo.svg';
import { Button, Container } from 'semantic-ui-react'

import './App.css';
import {ListOrder} from "./components/CreateOrderFormContainer";
import OrderFormModal from "./components/OrderFormModal";

function App() {

  const [showOrderCreateForm, setShowOrderCreateForm] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  return (
      <div>
        <OrderFormModal open={showOrderCreateForm} onSuccess={() => {
          setShowOrderCreateForm(false);
          setActiveOrder(null);
        }} order={activeOrder} />
        <Container>
          <Button onClick={() => setShowOrderCreateForm(true)}>
            Create Order
          </Button>
        </Container>
        <ListOrder handleRowClicked={order => {
          setActiveOrder(order);
          setShowOrderCreateForm(true)
        }} />

      </div>
  );
}

export default App;
