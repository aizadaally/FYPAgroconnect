// src/services/api.js

import axios from 'axios';
const DEBUG = true; // Set to false in production
const API_URL = '/api'; 

// Create axios instance with CSRF token support
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.response.use(
    (response) => {
      if (DEBUG) console.log('API Response:', response);
      return response;
    },
    (error) => {
      if (DEBUG) console.error('API Error:', error.response || error);
      return Promise.reject(error);
    }
  );

// Add a request interceptor to include CSRF token
apiClient.interceptors.request.use(config => {
  // Function to get CSRF token from cookies
  const getCookie = name => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register/', userData),
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  logout: () => apiClient.post('/auth/logout/'),
  getCurrentUser: () => apiClient.get('/auth/user/'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiClient.get('/categories/'),
  getById: (id) => apiClient.get(`/categories/${id}/`),
};

// Products API
export const productsAPI = {
  getAll: () => apiClient.get('/products/'),
  getById: (id) => apiClient.get(`/products/${id}/`),
  getByCategory: (categoryId) => apiClient.get(`/products/by_category/?category_id=${categoryId}`),
  getMyProducts: () => apiClient.get('/products/my_products/'),
  create: (productData) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(productData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, productData[key]);
      }
    });
    
    // Add image if it exists
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    return apiClient.post('/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: (id, productData) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(productData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, productData[key]);
      }
    });
    
    // Add image if it exists
    if (productData.image && productData.image instanceof File) {
      formData.append('image', productData.image);
    }
    
    return apiClient.put(`/products/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => apiClient.delete(`/products/${id}/`),
};

// Orders API
export const ordersAPI = {
  getAll: () => apiClient.get('/orders/'),
  getById: (id) => apiClient.get(`/orders/${id}/`),
  getCart: () => apiClient.get('/orders/cart/'),
  addItem: (orderId, item) => apiClient.post(`/orders/${orderId}/add_item/`, item),
  removeItem: (orderId, itemId) => apiClient.post(`/orders/${orderId}/remove_item/`, { item_id: itemId }),
  updateItemQuantity: (orderId, itemId, quantity) => apiClient.post(
    `/orders/${orderId}/update_item_quantity/`, 
    { item_id: itemId, quantity }
  ),
  checkout: (orderId, data) => apiClient.post(`/orders/${orderId}/checkout/`, data),
  markAsPaid: (orderId) => apiClient.post(`/orders/${orderId}/mark_as_paid/`),
};

export default {
  auth: authAPI,
  categories: categoriesAPI,
  products: productsAPI,
  orders: ordersAPI,
};