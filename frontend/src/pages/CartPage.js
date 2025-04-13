// src/pages/CartPage.js

import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';

function CartPage() {
  const { cart, loading, error } = useCart();
  const navigate = useNavigate();
  const [checkoutError, setCheckoutError] = useState('');

  // Safe function to format currency values
  const formatCurrency = (value) => {
    // Check if value exists and convert it to a number
    const numValue = parseFloat(value || 0);
    // Return formatted string with 2 decimal places
    return numValue.toFixed(2);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="alert alert-danger my-5" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body className="text-center py-5">
                <h3 className="mb-4">Your cart is empty</h3>
                <p className="mb-4">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Link to="/" className="btn btn-success">
                  Browse Products
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // Debug log to see what's in the cart
  console.log('Cart data:', cart);
  console.log('Total amount type:', typeof cart.total_amount);

  return (
    <Container className="py-4">
      <h1 className="mb-4">Shopping Cart</h1>
      
      {checkoutError && (
        <Alert variant="danger" className="mb-4">
          {checkoutError}
        </Alert>
      )}
      
      <Row>
        <Col lg={8}>
          <ListGroup className="mb-4">
            {cart.items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </ListGroup>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Items ({cart.items.length}):</span>
                <span>${formatCurrency(cart.total_amount)}</span>
              </div>
              
              <hr className="my-3" />
              
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0">Total:</h5>
                <h5 className="mb-0">${formatCurrency(cart.total_amount)}</h5>
              </div>
              
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 mt-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
          
          <div className="d-grid gap-2 mt-3">
            <Link to="/" className="btn btn-outline-secondary">
              Continue Shopping
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;