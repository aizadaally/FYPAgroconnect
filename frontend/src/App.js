// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import OrderHistoryPage from './pages/OrderHistoryPage';

import OrderDetailPage from './pages/OrderDetailPage';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import FarmerDashboard from './pages/FarmerDashboard';
import ProductFormPage from './pages/ProductFormPage';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                
                {/* Protected Routes */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders/:orderId/confirmation" element={<OrderConfirmationPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} /> {/* Add this line here */}
                <Route path="/orders" element={<OrderHistoryPage />} />
                
                
                {/* Farmer Routes */}
                <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                <Route path="/farmer/products/new" element={<ProductFormPage />} />
                <Route path="/farmer/products/:productId/edit" element={<ProductFormPage />} />
                
                {/* Fallback Routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider> 
    </Router>
  );
}

export default App;