// src/components/MobileNav.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function MobileNav() {
  const location = useLocation();
  const { currentUser, isFarmer } = useAuth();
  
  // Don't show on desktop
  if (window.innerWidth > 768) return null;
  
  return (
    <div className="d-md-none fixed-bottom bg-white shadow-lg py-2" style={{ zIndex: 1000 }}>
      <Container>
        <Row className="text-center gx-0">
          <Col xs={isFarmer() ? 3 : 4}>
            <Link to="/" className="d-flex flex-column align-items-center text-decoration-none">
              <i className={`bi bi-house${location.pathname === '/' ? '-fill' : ''}`} style={{ color: location.pathname === '/' ? '#28a879' : '#6c757d' }}></i>
              <span className="small" style={{ color: location.pathname === '/' ? '#28a879' : '#6c757d' }}>Home</span>
            </Link>
          </Col>
          
          <Col xs={isFarmer() ? 3 : 4}>
            <Link to="/search" className="d-flex flex-column align-items-center text-decoration-none">
              <i className={`bi bi-search${location.pathname === '/search' ? '-fill' : ''}`} style={{ color: location.pathname === '/search' ? '#28a879' : '#6c757d' }}></i>
              <span className="small" style={{ color: location.pathname === '/search' ? '#28a879' : '#6c757d' }}>Browse</span>
            </Link>
          </Col>
          
          {isFarmer() && (
            <Col xs={3}>
              <Link to="/farmer/dashboard" className="d-flex flex-column align-items-center text-decoration-none">
                <i className={`bi bi-shop${location.pathname.includes('/farmer') ? '-fill' : ''}`} style={{ color: location.pathname.includes('/farmer') ? '#28a879' : '#6c757d' }}></i>
                <span className="small" style={{ color: location.pathname.includes('/farmer') ? '#28a879' : '#6c757d' }}>Store</span>
              </Link>
            </Col>
          )}
          
          <Col xs={isFarmer() ? 3 : 4}>
            <Link to="/orders" className="d-flex flex-column align-items-center text-decoration-none">
              <i className={`bi bi-receipt${location.pathname === '/orders' ? '-fill' : ''}`} style={{ color: location.pathname === '/orders' ? '#28a879' : '#6c757d' }}></i>
              <span className="small" style={{ color: location.pathname === '/orders' ? '#28a879' : '#6c757d' }}>Orders</span>
            </Link>
          </Col>
          
          <Col xs={isFarmer() ? 3 : 4}>
            <Link to="/profile" className="d-flex flex-column align-items-center text-decoration-none">
              <i className={`bi bi-person${location.pathname === '/profile' ? '-fill' : ''}`} style={{ color: location.pathname === '/profile' ? '#28a879' : '#6c757d' }}></i>
              <span className="small" style={{ color: location.pathname === '/profile' ? '#28a879' : '#6c757d' }}>Profile</span>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MobileNav;