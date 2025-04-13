// src/pages/OrderConfirmationPage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { ordersAPI } from '../services/api';

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getById(orderId);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

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

  if (error || !order) {
    return (
      <Container>
        <div className="alert alert-danger my-5" role="alert">
          {error || 'Order not found'}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="border-success mb-4">
            <Card.Header className="bg-success text-white text-center">
              <h2 className="mb-0">Order Confirmed!</h2>
            </Card.Header>
            <Card.Body className="text-center py-4">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4 className="mb-3">Thank you for your order</h4>
              <p className="mb-1">Order #{order.id}</p>
              <p className="text-muted">Placed on {new Date(order.created_at).toLocaleString()}</p>
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h4 className="mb-0">Order Details</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <h5>Delivery Information</h5>
                  <p className="mb-1">Delivery Address:</p>
                  <p className="text-muted">{order.delivery_address}</p>
                  <p className="mb-1">Contact Phone:</p>
                  <p className="text-muted">{order.contact_phone}</p>
                </Col>
                <Col md={6}>
                  <h5>Order Summary</h5>
                  <p className="mb-1">Status: <span className="badge bg-success">{order.status}</span></p>
                  <p className="mb-1">Payment: <span className="badge bg-success">{order.is_paid ? 'Paid' : 'Pending'}</span></p>
                  <p className="mb-1">Total Amount: <strong>${order.total_amount.toFixed(2)}</strong></p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h4 className="mb-0">Ordered Items</h4>
            </Card.Header>
            <ListGroup variant="flush">
              {order.items.map(item => (
                <ListGroup.Item key={item.id}>
                  <Row className="align-items-center">
                    <Col xs={6} md={8}>
                      <h5 className="mb-1">{item.product_name}</h5>
                      <p className="text-muted mb-0">
                        Price: ${item.product_price} per unit
                      </p>
                    </Col>
                    <Col xs={3} md={2} className="text-center">
                      <p className="mb-0">Qty: {item.quantity}</p>
                    </Col>
                    <Col xs={3} md={2} className="text-end">
                      <p className="mb-0"><strong>${(item.product_price * item.quantity).toFixed(2)}</strong></p>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
          
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-success">
              Continue Shopping
            </Link>
            <Link to="/orders" className="btn btn-outline-secondary">
              View All Orders
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default OrderConfirmationPage;