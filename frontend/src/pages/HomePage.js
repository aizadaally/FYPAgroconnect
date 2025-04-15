// src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import farmImage from '../assets/images/farm.jpg';

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('vegetable')) return 'bi bi-flower1';
  if (name.includes('fruit')) return 'bi bi-apple';
  if (name.includes('dairy')) return 'bi bi-cup-hot';
  if (name.includes('meat')) return 'bi bi-egg-fried';
  if (name.includes('grain')) return 'bi bi-tree';
  if (name.includes('herb')) return 'bi bi-flower3';
  return 'bi bi-basket';
};

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
    <>
      {/* Hero Section */}
      <div 
  className="bg-farm-gradient py-5" 
  style={{
    marginTop: '-60px', 
    paddingTop: '120px',
    backgroundImage: `url(${require('../assets/images/kyrgyzstan.jpg')})`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlend: 'overlay'
  }}
>
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="display-4 fw-bold mb-4">Fresh From Farm to Table</h1>
                <p className="lead mb-4">
                  AgroConnect brings you the freshest produce directly from local Kyrgyz farmers to your table.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Button 
                    as={Link} 
                    to="/" 
                    variant="light" 
                    size="lg" 
                    className="fw-medium shadow-sm"
                  >
                    Browse Products
                  </Button>
                  <Button 
                    as={Link} 
                    to="/signup" 
                    variant="outline-light" 
                    size="lg"
                    className="fw-medium"
                  >
                    Join Us
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} className="d-none d-lg-block text-center mt-4 mt-lg-0">
              <motion.img
                // src={farmImage}
                // alt="Farm Illustration"
                // className="img-fluid rounded"
                // style={{ maxHeight: '350px' }}
                // initial={{ opacity: 0, scale: 0.8 }}
                // animate={{ opacity: 1, scale: 1 }}
                // transition={{ duration: 0.5, delay: 0.2 }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Categories Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 position-relative">
            <span className="bg-light px-3 position-relative" style={{ zIndex: 2 }}>Browse Categories</span>
            <div className="position-absolute" style={{ height: '2px', background: '#e0e0e0', width: '100%', top: '50%', left: 0, zIndex: 1 }}></div>
          </h2>
          
          {/* Category cards */}
          <Row className="g-4 justify-content-center">
            {categories.map(category => (
              <Col key={category.id} md={4} sm={6}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    onClick={() => handleCategoryClick(category.id)}
                    className={`cursor-pointer h-100 border-0 shadow-sm ${selectedCategory === category.id ? 'bg-success bg-opacity-10' : 'bg-white'}`}
                    style={{ cursor: 'pointer', borderRadius: '12px', overflow: 'hidden' }}
                  >
                    <div className={`p-3 text-center ${selectedCategory === category.id ? 'bg-success text-white' : 'bg-success bg-opacity-75 text-white'}`}>
                      <h5 className="mb-0">{category.name}</h5>
                    </div>
                    <Card.Body className="d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
                      <i className={getCategoryIcon(category.name)} style={{ fontSize: '2rem', color: '#28a879' }}></i>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <section className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Featured Products</h2>
            {selectedCategory && (
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Clear Filter
              </Button>
            )}
          </div>
          
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
      </section>

      {/* Farmer Features Section */}
      <section className="py-5" style={{ backgroundColor: '#e8f5e9' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-4 text-success">Why Join as a Farmer?</h2>
                <div className="d-flex align-items-start mb-4">
                  <div className="bg-success rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                    <i className="bi bi-cash text-white" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h5>Direct Sales</h5>
                    <p>Sell directly to customers without middlemen and increase your profits.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-4">
                  <div className="bg-success rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                    <i className="bi bi-people text-white" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h5>Grow Your Customer Base</h5>
                    <p>Reach more customers across Kyrgyzstan through our platform.</p>
                  </div>
                </div>
                <Button variant="success" size="lg" as={Link} to="/signup" className="mt-2">
                  Register as Farmer
                </Button>
              </motion.div>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Farmer" 
                  className="img-fluid rounded-3 shadow"
                  style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5">What Our Users Say</h2>
          <Row className="justify-content-center">
            <Col md={4} className="mb-4">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-light rounded-3 p-4 h-100 shadow-sm"
              >
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success rounded-circle text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                    <span className="fw-bold">AB</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Askar Bakiev</h5>
                    <p className="text-muted mb-0">Farmer</p>
                  </div>
                </div>
                <p className="mb-0">
                  "AgroConnect has transformed my business. I've connected with buyers from across the country and increased my revenue by 40%."
                </p>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-light rounded-3 p-4 h-100 shadow-sm"
              >
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success rounded-circle text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                    <span className="fw-bold">MK</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Maria Kim</h5>
                    <p className="text-muted mb-0">Buyer</p>
                  </div>
                </div>
                <p className="mb-0">
                  "I love getting fresh vegetables directly from local farms. The quality is amazing and I'm supporting local farmers."
                </p>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-light rounded-3 p-4 h-100 shadow-sm"
              >
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success rounded-circle text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                    <span className="fw-bold">TS</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Turat Sultanov</h5>
                    <p className="text-muted mb-0">Farmer</p>
                  </div>
                </div>
                <p className="mb-0">
                  "The platform is easy to use and has helped me reach customers in Bishkek who appreciate quality organic produce."
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default HomePage;