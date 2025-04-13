// src/pages/ProductFormPage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function ProductFormPage() {
  const { productId } = useParams();
  const isEditMode = !!productId;
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    quantity_available: '',
    unit: 'kg',
    is_available: true,
    image: null
  });
  
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [originalImage, setOriginalImage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
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
        
        // Fetch categories
        const categoriesResponse = await categoriesAPI.getAll();
        setCategories(categoriesResponse.data);
        
        // If editing, fetch product details
        if (isEditMode) {
          const productResponse = await productsAPI.getById(productId);
          const product = productResponse.data;
          
          setFormData({
            name: product.name,
            category: product.category || '',
            description: product.description || '',
            price: product.price,
            quantity_available: product.quantity_available,
            unit: product.unit,
            is_available: product.is_available,
            image: null
          });
          
          if (product.image) {
            setOriginalImage(`http://localhost:8000${product.image}`);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setFormError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, isFarmer, navigate, isEditMode, productId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (files && files[0]) {
        setFormData({
          ...formData,
          image: files[0]
        });
        
        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.quantity_available) {
      newErrors.quantity_available = 'Quantity is required';
    } else if (isNaN(formData.quantity_available) || parseInt(formData.quantity_available) < 0) {
      newErrors.quantity_available = 'Quantity must be a non-negative number';
    }
    
    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setFormError('');
    setFormSuccess('');
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity_available: parseInt(formData.quantity_available)
      };
      
      if (isEditMode) {
        await productsAPI.update(productId, productData);
        setFormSuccess('Product updated successfully!');
      } else {
        const response = await productsAPI.create(productData);
        setFormSuccess('Product created successfully!');
        // Redirect to edit page after creation
        navigate(`/farmer/products/${response.data.id}/edit`);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setFormError('Failed to save product. Please try again.');
    } finally {
      setSaving(false);
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

  return (
    <Container className="py-4">
      <h1 className="mb-4">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      
      {formError && (
        <Alert variant="danger" className="mb-4">
          {formError}
        </Alert>
      )}
      
      {formSuccess && (
        <Alert variant="success" className="mb-4">
          {formSuccess}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                isInvalid={!!errors.category}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.category}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Row>
              <Form.Group as={Col} md={4} className="mb-3" controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group as={Col} md={4} className="mb-3" controlId="quantity_available">
              // src/pages/ProductFormPage.js (continued)

<Form.Label>Quantity Available</Form.Label>
<Form.Control
  type="number"
  min="0"
  name="quantity_available"
  value={formData.quantity_available}
  onChange={handleChange}
  isInvalid={!!errors.quantity_available}
/>
<Form.Control.Feedback type="invalid">
  {errors.quantity_available}
</Form.Control.Feedback>
</Form.Group>

<Form.Group as={Col} md={4} className="mb-3" controlId="unit">
<Form.Label>Unit</Form.Label>
<Form.Select
  name="unit"
  value={formData.unit}
  onChange={handleChange}
  isInvalid={!!errors.unit}
>
  <option value="kg">Kilogram (kg)</option>
  <option value="g">Gram (g)</option>
  <option value="piece">Piece</option>
  <option value="bundle">Bundle</option>
  <option value="box">Box</option>
  <option value="dozen">Dozen</option>
</Form.Select>
<Form.Control.Feedback type="invalid">
  {errors.unit}
</Form.Control.Feedback>
</Form.Group>
</Row>

<Form.Group className="mb-3" controlId="is_available">
<Form.Check
type="checkbox"
label="Product is available for sale"
name="is_available"
checked={formData.is_available}
onChange={handleChange}
/>
</Form.Group>
</Col>

<Col md={4}>
<Form.Group className="mb-3" controlId="image">
<Form.Label>Product Image</Form.Label>
<Form.Control
type="file"
name="image"
accept="image/*"
onChange={handleChange}
/>
<Form.Text className="text-muted">
Upload a clear image of your product. Max size: 5MB.
</Form.Text>
</Form.Group>

{(previewImage || originalImage) && (
<div className="mb-3">
<p className="mb-2">Image Preview:</p>
<Image
  src={previewImage || originalImage}
  alt="Product preview"
  thumbnail
  style={{ maxHeight: '200px' }}
/>
</div>
)}
</Col>
</Row>

<div className="d-flex justify-content-between mt-4">
<Button 
variant="outline-secondary" 
onClick={() => navigate('/farmer/dashboard')}
>
Cancel
</Button>

<Button 
variant="success" 
type="submit"
disabled={saving}
>
{saving ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
</Button>
</div>
</Form>
</Container>
);
}

export default ProductFormPage;