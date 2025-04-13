// src/pages/OrderHistoryPage.js

import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isFarmer } = useAuth();

  // Safe function to format currency values
  const formatCurrency = (value) => {
    const numValue = parseFloat(value || 0);
    return numValue.toFixed(2);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getAll();
        
        // Filter out any "cart" status orders
        const completedOrders = response.data.filter(
          order => order.status !== 'CART'
        );
        
        // Sort by creation date (newest first)
        completedOrders.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setOrders(completedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      <h1 className="mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <h4 className="mb-3">You haven't placed any orders yet</h4>
            <p className="mb-4">
              Browse our products and place your first order!
            </p>
            <Link to="/" className="btn btn-success">
              Browse Products
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>{isFarmer() ? 'Buyer' : 'Items'}</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    {isFarmer() ? (
                      order.buyer_name
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {order.items.map(item => (
                          <li key={item.id}>
                            {item.quantity} x {item.product_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>${formatCurrency(order.total_amount)}</td>
                  <td>
                    <Badge bg={
                      order.status === 'COMPLETED' ? 'success' :
                      order.status === 'ORDERED' ? 'primary' :
                      order.status === 'CANCELLED' ? 'danger' : 'warning'
                    }>
                      {order.status}
                    </Badge>
                    {order.is_paid && (
                      <Badge bg="success" className="ms-1">PAID</Badge>
                    )}
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
    </Container>
  );
}

export default OrderHistoryPage;