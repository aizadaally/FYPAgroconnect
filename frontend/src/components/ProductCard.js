// src/components/ProductCard.js

import React, { useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

function ProductCard({ product }) {
  const { currentUser, isBuyer } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert('Product added to cart!');
    } catch (error) {
      alert('Failed to add product to cart.');
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
    <Card className="h-100">
      <div style={{ height: '200px', overflow: 'hidden' }}>
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
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-muted mb-1">
          {product.category_name}
        </Card.Text>
        <Card.Text className="mb-1">
          {product.price} per {product.unit}
        </Card.Text>
        <Card.Text className="mb-3">
          {product.quantity_available} {product.unit} available
        </Card.Text>
        <div className="mt-auto d-flex justify-content-between">
          <Link to={`/products/${product.id}`} className="btn btn-outline-success">
            View Details
          </Link>
          {currentUser && isBuyer() && (
            <Button variant="success" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;