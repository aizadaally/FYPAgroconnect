// src/pages/ProductDetailPage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Card, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [imageError, setImageError] = useState(false);
  
  const { currentUser, isBuyer, isFarmer } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(productId);
        console.log('Product data from API:', response.data);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Image URL handler with more robust checks
  const getImageUrl = (imagePath) => {
    console.log('Raw image path:', imagePath);
    
    if (!imagePath) {
      console.log('No image path, using placeholder');
      return 'https://via.placeholder.com/400';
    }
    
    // If it's already an absolute URL
    if (imagePath.startsWith('http')) {
      console.log('Image is already an absolute URL');
      return imagePath;
    }
    
    // If it's a relative URL starting with /media
    if (imagePath.startsWith('/media')) {
      console.log('Image is a relative URL starting with /media');
      return `http://localhost:8000${imagePath}`;
    }
    
    // If it doesn't start with /, add the full path
    console.log('Image needs full path construction');
    return `http://localhost:8000/media/${imagePath}`;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.quantity_available) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setCartMessage('');
      
      await addToCart(product.id, quantity);
      setCartMessage('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      setCartMessage('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleEditProduct = () => {
    navigate(`/farmer/products/${productId}/edit`);
  };

  const handleImageError = () => {
    console.log('Image failed to load');
    setImageError(true);
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

  if (error || !product) {
    return (
      <Container>
        <div className="alert alert-danger my-5" role="alert">
          {error || 'Product not found'}
        </div>
      </Container>
    );
  }

  // Get the proper image URL
  const imageUrl = imageError 
    ? 'https://via.placeholder.com/400?text=' + encodeURIComponent(product.name)
    : getImageUrl(product.image);

  // Format phone number for URLs by removing non-digits
  const formatPhoneForUrl = (phone) => {
    return phone ? phone.replace(/[^0-9]/g, '') : '';
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={6} className="mb-4">
          <Image 
            src={imageUrl} 
            alt={product.name} 
            fluid 
            className="rounded"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
            onError={handleImageError}
          />
          <div className="mt-2 text-muted small">
            Image path: {product.image || 'No image available'}
          </div>
        </Col>
        
        <Col md={6}>
          <h2 className="mb-3">{product.name}</h2>
          
          <p className="text-muted mb-2">
            Category: {product.category_name}
          </p>
          
          <p className="text-muted mb-3">
            Sold by: {product.farmer_name}
          </p>
          
          <h4 className="mb-3">${product.price} per {product.unit}</h4>
          
          <p className="mb-4">
            Available: {product.quantity_available} {product.unit}
          </p>
          
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Description</h5>
              <p className="mb-0">{product.description || 'No description available.'}</p>
            </Card.Body>
          </Card>
          
          {/* Seller Contact Information Card */}
          {currentUser && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Seller Contact</h5>
                <p className="mb-2">
                  <strong>Name:</strong> {product.farmer_name}
                </p>
                <p className="mb-2">
                  <strong>Phone:</strong> {product.farmer_phone || 'Not available'}
                </p>
                {product.farmer_phone && (
                  <div className="d-flex gap-2">
                    <a 
                      href={`https://wa.me/${formatPhoneForUrl(product.farmer_phone)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-success"
                    >
                      <i className="bi bi-whatsapp me-1"></i> WhatsApp
                    </a>
                    <a 
                      href={`tel:${formatPhoneForUrl(product.farmer_phone)}`} 
                      className="btn btn-sm btn-outline-success"
                    >
                      <i className="bi bi-telephone me-1"></i> Call
                    </a>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
          
          {currentUser && isBuyer() && (
            <>
              <div className="d-flex align-items-center mb-3">
                <Form.Label className="me-3 mb-0">Quantity:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={product.quantity_available}
                  value={quantity}
                  onChange={handleQuantityChange}
                  style={{ width: '80px' }}
                />
                <span className="ms-2">{product.unit}</span>
              </div>
              
              {cartMessage && (
                <Alert variant={cartMessage.includes('success') ? 'success' : 'danger'} className="mb-3">
                  {cartMessage}
                </Alert>
              )}
              
              <Button 
                variant="success" 
                size="lg" 
                onClick={handleAddToCart} 
                disabled={addingToCart || !product.is_available || product.quantity_available <= 0}
                className="w-100"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              
              {(!product.is_available || product.quantity_available <= 0) && (
                <div className="text-danger mt-2">
                  This product is currently unavailable.
                </div>
              )}
            </>
          )}
          
          {currentUser && isFarmer() && product.farmer === currentUser.id && (
            <Button 
              variant="outline-success" 
              size="lg" 
              onClick={handleEditProduct}
              className="w-100"
            >
              Edit Product
            </Button>
          )}
          
          {!currentUser && (
            <Alert variant="info">
              Please <a href="/login" className="alert-link">login</a> to purchase this product and view seller contact information.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailPage;