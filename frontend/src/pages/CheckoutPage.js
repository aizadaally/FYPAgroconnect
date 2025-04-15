// src/pages/CheckoutPage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';



function CheckoutPage() {
  const { currentUser } = useAuth();
  const { cart, checkout, loading, error } = useCart();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    delivery_address: '',
    contact_phone: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Safe function to format currency values
  const formatCurrency = (value) => {
    // Check if value exists and convert it to a number
    const numValue = parseFloat(value || 0);
    // Return formatted string with 2 decimal places
    return numValue.toFixed(2);
  };

  useEffect(() => {
    // Fill form with user data if available
    if (currentUser) {
      setFormData({
        delivery_address: currentUser.address || '',
        contact_phone: currentUser.phone_number || '',
      });
    }
  }, [currentUser]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && (!cart || !cart.items || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = 'Delivery address is required';
    }
    
    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = 'Contact phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setCheckoutError('');
    
    try {
      const order = await checkout(formData);
      navigate(`/orders/${order.id}/confirmation`);
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError('Failed to complete checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

  // Debug log to see what's in the cart
  console.log('Cart data in checkout:', cart);
  console.log('Total amount type:', typeof cart.total_amount);

  return (
    <Container className="py-4">
      <h1 className="mb-4">Checkout</h1>
      
      {checkoutError && (
        <Alert variant="danger" className="mb-4">
          {checkoutError}
        </Alert>
      )}
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Delivery Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="delivery_address">
                  <Form.Label>Delivery Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleChange}
                    isInvalid={!!errors.delivery_address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.delivery_address}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="contact_phone">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    isInvalid={!!errors.contact_phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contact_phone}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <div className="d-flex justify-content-between mt-4">
                  <Link to="/cart" className="btn btn-outline-secondary">
                    Back to Cart
                  </Link>
                  
                  <Button 
                    variant="success" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush" className="mb-3">
                {cart?.items.map(item => (
                  <ListGroup.Item key={item.id} className="px-0 py-2 border-bottom">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="mb-0 fw-semibold">{item.product_name}</p>
                        <p className="text-muted small mb-0">
                          {item.quantity} x ${parseFloat(item.product_price || 0).toFixed(2)}
                        </p>
                      </div>
                      <p className="mb-0">
                        ${(parseFloat(item.product_price || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0">Total:</h5>
                <h5 className="mb-0">${formatCurrency(cart?.total_amount)}</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CheckoutPage;