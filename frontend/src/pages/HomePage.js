// src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import axios from 'axios'; // Add this import

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  
useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data from API...');
        
        // Test API connection
        try {
          // Simple test to check if API is reachable

          const testResponse = await axios.get('http://localhost:8000/api/products/');
          console.log('API test response:', testResponse);
        } catch (testErr) {
          console.error('API test error:', testErr);
        }
        
        // Continue with normal flow...
        const categoriesResponse = await categoriesAPI.getAll();
        setCategories(categoriesResponse.data);
        
        const productsResponse = await productsAPI.getAll();
        setProducts(productsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (selectedCategory) {
        try {
          setLoading(true);
          const response = await productsAPI.getByCategory(selectedCategory);
          setProducts(response.data);
        } catch (err) {
          console.error('Error fetching products by category:', err);
          setError('Failed to load products');
        } finally {
          setLoading(false);
        }
      } else {
        // If no category is selected, fetch all products
        try {
          setLoading(true);
          const response = await productsAPI.getAll();
          setProducts(response.data);
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('Failed to load products');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductsByCategory();
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
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
    <Container>
      <h1 className="mb-4">Welcome to AgroConnect</h1>
      <p className="lead mb-4">
        Browse fresh produce directly from local farmers.
      </p>

      <h3 className="mb-3">Categories</h3>
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-wrap gap-2">
            {categories.map(category => (
              <Card 
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`cursor-pointer ${selectedCategory === category.id ? 'bg-success text-white' : 'bg-light'}`}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="py-2 px-3">
                  {category.name}
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>

      <h3 className="mb-3">Products</h3>
      <Row xs={1} md={2} lg={3} className="g-4">
        {products.map(product => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
        {products.length === 0 && (
          <Col xs={12}>
            <div className="alert alert-info">
              No products found. Please check back later.
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default HomePage;