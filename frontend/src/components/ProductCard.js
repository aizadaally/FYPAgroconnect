// src/components/ProductCard.js

import React, { useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

import { useNotification } from '../contexts/NotificationContext';

function ProductCard({ product }) {
  const { currentUser, isBuyer } = useAuth();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      // Replace alert with showNotification
      showNotification(`${product.name} added to cart!`, 'success');
    } catch (error) {
      // Replace alert with showNotification
      showNotification('Failed to add product to cart.', 'danger');
    }
  };

  // Improved image URL handling
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    
    // If it's already an absolute URL
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative URL starting with /media
    if (imagePath.startsWith('/media')) return `http://localhost:8000${imagePath}`;
    
    // Otherwise, assume it needs the full path
    return `http://localhost:8000/media/${imagePath}`;
  };

  const imageUrl = getImageUrl(product.image);
  
  // Debug the image URL (you can remove this later)
  useEffect(() => {
    console.log(`Product: ${product.name}, Image path: ${product.image}`);
    console.log(`Resolved image URL: ${imageUrl}`);
  }, [product, imageUrl]);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-100"
    >
      <Card className="h-100 border-0 shadow-sm overflow-hidden product-card">
        <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
          <Card.Img 
            variant="top" 
            src={imageUrl} 
            alt={product.name} 
            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            onError={(e) => {
              console.log(`Image failed to load: ${imageUrl}`);
              e.target.src = 'https://via.placeholder.com/150?text=' + encodeURIComponent(product.name);
            }}
          />
          {product.is_organic && (
            <Badge 
              bg="success" 
              className="position-absolute top-0 end-0 m-2 px-2 py-1"
            >
              Organic
            </Badge>
          )}
        </div>
        <Card.Body className="d-flex flex-column">
          <div className="small text-muted mb-1">{product.category_name}</div>
          <Card.Title className="fw-bold">{product.name}</Card.Title>
          
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-success">{product.price}</span>
            <span className="text-muted small">per {product.unit}</span>
          </div>
          
          <div className="text-muted small mb-3">
            {product.quantity_available} {product.unit} available
          </div>
          
          <div className="mt-auto d-flex justify-content-between gap-2">
            <Link 
              to={`/products/${product.id}`} 
              className="btn btn-sm btn-outline-success flex-grow-1"
            >
              View Details
            </Link>
            {currentUser && isBuyer() && (
              <Button 
                variant="success" 
                size="sm"
                className="flex-grow-1"
                onClick={handleAddToCart}
                disabled={!product.is_available || product.quantity_available <= 0}
              >
                <i className="bi bi-cart-plus me-1"></i>
                Add to Cart
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}

export default ProductCard;