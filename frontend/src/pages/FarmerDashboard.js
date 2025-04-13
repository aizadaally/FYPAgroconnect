// src/pages/FarmerDashboard.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser, isFarmer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not a farmer
    if (currentUser && !isFarmer()) {
      navigate('/');
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch farmer's products
        const productsResponse = await productsAPI.getMyProducts();
        setProducts(productsResponse.data);
        
        // Fetch orders that contain the farmer's products
        const ordersResponse = await ordersAPI.getAll();
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, isFarmer, navigate]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        setProducts(products.filter(product => product.id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
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

  return (
    <Container className="py-4">
      <h1 className="mb-4">Farmer Dashboard</h1>
      
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>My Products</h3>
            <Button 
              as={Link}
              to="/farmer/products/new"
              variant="success"
            >
              Add New Product
            </Button>
          </div>
          
          {products.length === 0 ? (
            <Alert variant="info">
              You haven't added any products yet. Click the "Add New Product" button to get started.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category_name}</td>
                      <td>${product.price} / {product.unit}</td>
                      <td>{product.quantity_available} {product.unit}</td>
                      <td>
                        {product.is_available ? (
                          <Badge bg="success">Available</Badge>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          as={Link}
                          to={`/products/${product.id}`}
                          variant="outline-success"
                          size="sm"
                          className="me-2"
                        >
                          View
                        </Button>
                        <Button
                          as={Link}
                          to={`/farmer/products/${product.id}/edit`}
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
      
      <Row>
        <Col>
          <h3 className="mb-3">Recent Orders</h3>
          
          {orders.length === 0 ? (
            <Alert variant="info">
              No orders have been placed for your products yet.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.buyer_name}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>${order.total_amount}</td>
                      <td>
                        <Badge bg={
                          order.status === 'COMPLETED' ? 'success' :
                          order.status === 'ORDERED' ? 'primary' :
                          order.status === 'CANCELLED' ? 'danger' : 'warning'
                        }>
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          as={Link}
                          to={`/orders/${order.id}`}
                          variant="outline-success"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default FarmerDashboard;