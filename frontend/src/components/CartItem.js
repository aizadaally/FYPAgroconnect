// src/components/CartItem.js

import React, { useState } from 'react';
import { ListGroup, Row, Col, Form, Button } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
  };

  const handleUpdateQuantity = async () => {
    if (quantity <= 0) {
      handleRemoveItem();
      return;
    }
    
    try {
      setIsUpdating(true);
      await updateQuantity(item.id, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    try {
      await removeFromCart(item.id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <ListGroup.Item>
      <Row className="align-items-center">
        <Col xs={12} md={6}>
          <h5>{item.product_name}</h5>
          <p className="text-muted">Price: ${item.product_price} per unit</p>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="me-2 mb-0">Quantity:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: '70px' }}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={3} className="mt-2 mt-md-0 text-end">
        <p><strong>Subtotal: ${(parseFloat(item.product_price || 0) * parseInt(item.quantity || 0)).toFixed(2)}</strong></p>
          <Button
            variant="outline-success"
            size="sm"
            onClick={handleUpdateQuantity}
            disabled={isUpdating || quantity === item.quantity}
            className="me-2"
          >
            Update
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleRemoveItem}
          >
            Remove
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}

export default CartItem;