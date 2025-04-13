// src/pages/SignupPage.js

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_type: 'BUYER',
    phone_number: '',
    address: '',
    farm_name: '',
    farm_location: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

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


  // src/pages/SignupPage.js (continued)

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (formData.user_type === 'FARMER') {
      if (!formData.farm_name.trim()) {
        newErrors.farm_name = 'Farm name is required for farmers';
      }
      
      if (!formData.farm_location.trim()) {
        newErrors.farm_location = 'Farm location is required for farmers';
      }
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
    setSignupError('');
    
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError(
        error.response?.data?.error || 
        'Registration failed. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="card">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Sign Up for AgroConnect</h2>
              
              {signupError && (
                <Alert variant="danger">{signupError}</Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group as={Col} md={6} className="mb-3" controlId="user_type">
                    <Form.Label>I am a:</Form.Label>
                    <Form.Select
                      name="user_type"
                      value={formData.user_type}
                      onChange={handleChange}
                    >
                      <option value="BUYER">Buyer</option>
                      <option value="FARMER">Farmer</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                
                <Row>
                  <Form.Group as={Col} md={6} className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group as={Col} md={6} className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                
                <Row>
                  <Form.Group as={Col} md={6} className="mb-3" controlId="first_name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      isInvalid={!!errors.first_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.first_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group as={Col} md={6} className="mb-3" controlId="last_name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      isInvalid={!!errors.last_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.last_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                
                <Row>
                  <Form.Group as={Col} md={6} className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group as={Col} md={6} className="mb-3" controlId="phone_number">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      isInvalid={!!errors.phone_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone_number}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                
                <Row>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                
                {formData.user_type === 'FARMER' && (
                  <>
                    <Row>
                      <Form.Group as={Col} md={6} className="mb-3" controlId="farm_name">
                        <Form.Label>Farm Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="farm_name"
                          value={formData.farm_name}
                          onChange={handleChange}
                          isInvalid={!!errors.farm_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.farm_name}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group as={Col} md={6} className="mb-3" controlId="farm_location">
                        <Form.Label>Farm Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="farm_location"
                          value={formData.farm_location}
                          onChange={handleChange}
                          isInvalid={!!errors.farm_location}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.farm_location}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                  </>
                )}
                
                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100 mt-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing up...' : 'Sign Up'}
                </Button>
              </Form>
              
              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="text-success">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupPage;