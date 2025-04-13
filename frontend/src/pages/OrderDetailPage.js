// src/pages/OrderDetailPage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isFarmer } = useAuth();

  // Safe function to format currency values
  const formatCurrency = (value) => {
    const numValue = parseFloat(value || 0);
    return numValue.toFixed(2);
  };

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
    <Container className="py-4">
      <h1 className="mb-4">Order Details</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Order #{order.id}</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={6}>
                  <p className="mb-1"><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  <p className="mb-1"><strong>Status:</strong> 
                    <Badge bg={
                      order.status === 'COMPLETED' ? 'success' :
                      order.status === 'ORDERED' ? 'primary' :
                      order.status === 'CANCELLED' ? 'danger' : 'warning'
                    } className="ms-2">{order.status}</Badge>
                  </p>
                  <p className="mb-1"><strong>Payment Status:</strong> 
                    <Badge bg={order.is_paid ? 'success' : 'warning'} className="ms-2">
                      {order.is_paid ? 'Paid' : 'Pending'}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><strong>Total Amount:</strong> ${formatCurrency(order.total_amount)}</p>
                  <p className="mb-1"><strong>Delivery Address:</strong> {order.delivery_address}</p>
                  <p className="mb-1"><strong>Contact Phone:</strong> {order.contact_phone}</p>
                </Col>
              </Row>
              
              {/* Contact Section */}
              <Row className="mb-4">
                <Col>
                  <Card className="border-success">
                    <Card.Header className="bg-success bg-opacity-25">
                      <h5 className="mb-0">Contact Information</h5>
                    </Card.Header>
                    <Card.Body>
                      {isFarmer() ? (
                        <>
                          <h6>Buyer Contact:</h6>
                          <p className="mb-1"><strong>Name:</strong> {order.buyer_name}</p>
                          <p className="mb-1"><strong>Phone:</strong> {order.buyer_phone || order.contact_phone || 'Not available'}</p>
                          {(order.buyer_phone || order.contact_phone) && (
                            <div className="mt-2">
                              <a 
                                href={`https://wa.me/${(order.buyer_phone || order.contact_phone).replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-success me-2"
                              >
                                <i className="bi bi-whatsapp me-1"></i> WhatsApp
                              </a>
                              <a 
                                href={`tel:${(order.buyer_phone || order.contact_phone).replace(/[^0-9]/g, '')}`} 
                                className="btn btn-sm btn-outline-success"
                              >
                                <i className="bi bi-telephone me-1"></i> Call
                              </a>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <h6>Note to both parties:</h6>
                          <p className="mb-3">
                            Contact information is shared between buyer and seller to facilitate communication
                            about this order. Please use it responsibly.
                          </p>
                          <p className="text-muted small mb-0">
                            For any issues with the order, please contact AgroConnect support.
                          </p>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {order.items.map(item => {
                const productItem = item.product ? (
                  <>
                    {/* Product details display */}
                    <Row className="align-items-center">
                      <Col xs={6} md={8}>
                        <h5 className="mb-1">{item.product_name}</h5>
                        <p className="text-muted mb-0">
                          Price: ${formatCurrency(item.product_price)} per unit
                        </p>
                      </Col>
                      <Col xs={3} md={2} className="text-center">
                        <p className="mb-0">Qty: {item.quantity}</p>
                      </Col>
                      <Col xs={3} md={2} className="text-end">
                        <p className="mb-0"><strong>${formatCurrency(item.product_price * item.quantity)}</strong></p>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <p>Product information no longer available</p>
                );
                
                return (
                  <ListGroup.Item key={item.id}>
                    {productItem}
                    {!isFarmer() && item.product && (
                      <div className="mt-2 pt-2 border-top">
                        <strong>Seller Contact:</strong>
                        <p className="mb-1 mt-1">Name: {item.product.farmer_name}</p>
                        {item.product.farmer_phone && (
                          <>
                            <p className="mb-1">Phone: {item.product.farmer_phone}</p>
                            <div className="mt-1">
                              <a 
                                href={`https://wa.me/${item.product.farmer_phone.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-success me-2"
                              >
                                <i className="bi bi-whatsapp me-1"></i> WhatsApp
                              </a>
                              <a 
                                href={`tel:${item.product.farmer_phone.replace(/[^0-9]/g, '')}`} 
                                className="btn btn-sm btn-outline-success"
                              >
                                <i className="bi bi-telephone me-1"></i> Call
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Delivery Information</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-1"><strong>Address:</strong></p>
              <p className="mb-3">{order.delivery_address}</p>
              
              <p className="mb-1"><strong>Contact Phone:</strong></p>
              <p className="mb-0">{order.contact_phone}</p>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Items ({order.items.length}):</span>
                <span>${formatCurrency(order.total_amount)}</span>
              </div>
              
              <hr className="my-3" />
              
              <div className="d-flex justify-content-between mb-0">
                <h5 className="mb-0">Total:</h5>
                <h5 className="mb-0">${formatCurrency(order.total_amount)}</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OrderDetailPage;