// src/components/Header.js

import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import logo from '../assets/images/logo.png'; // Add your logo

function Header() {
  const { currentUser, logout, isFarmer } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Navbar 
      bg={scrolled ? "white" : "transparent"} 
      variant={scrolled ? "light" : "dark"} 
      expand="lg" 
      fixed="top"
      className={`py-3 transition-all ${scrolled ? 'shadow-sm' : ''}`}
      style={{
        transition: 'all 0.3s ease',
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img 
            src={logo} 
            height="40" 
            className="d-inline-block align-top me-2" 
            alt="AgroConnect Logo" 
          />
          <span className="fw-bold" style={{ fontFamily: "'Montserrat', sans-serif", color: '#28a879' }}>
            AgroConnect
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className="mx-2 fw-medium"
              style={{ color: scrolled ? '#333' : '#fff' }}
            >
              Home
            </Nav.Link>
            
            {currentUser && isFarmer() && (
              <Nav.Link 
                as={Link} 
                to="/farmer/dashboard" 
                className="mx-2 fw-medium"
                style={{ color: scrolled ? '#333' : '#fff' }}
              >
                Farmer Dashboard
              </Nav.Link>
            )}
            
            {currentUser ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/cart" 
                  className="mx-2 fw-medium position-relative"
                  style={{ color: scrolled ? '#333' : '#fff' }}
                >
                  Cart
                  {getItemCount() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                      {getItemCount()}
                    </span>
                  )}
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/orders" 
                  className="mx-2 fw-medium"
                  style={{ color: scrolled ? '#333' : '#fff' }}
                >
                  My Orders
                </Nav.Link>
                <Nav.Link 
                  onClick={handleLogout} 
                  className="ms-3 btn btn-sm btn-outline-success"
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className="mx-2 fw-medium"
                  style={{ color: scrolled ? '#333' : '#fff' }}
                >
                  Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/signup" 
                  className="ms-2 btn btn-success btn-sm px-3"
                >
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;