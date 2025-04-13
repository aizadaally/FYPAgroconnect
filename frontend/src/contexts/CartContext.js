// src/contexts/CartContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { ordersAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const response = await ordersAPI.getCart();
          setCart(response.data);
        } catch (err) {
          console.error('Error fetching cart:', err);
          setError('Failed to load cart');
        } finally {
          setLoading(false);
        }
      } else {
        setCart(null);
        setLoading(false);
      }
    };

    fetchCart();
  }, [currentUser]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      if (!cart) {
        throw new Error('Cart not initialized');
      }
      
      setError(null);
      const response = await ordersAPI.addItem(cart.id, { product_id: productId, quantity });
      setCart(response.data);
      return response.data;
    } catch (err) {
      console.error('Add to cart error:', err);
      setError('Failed to add item to cart');
      throw err;
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      if (!cart) {
        throw new Error('Cart not initialized');
      }
      
      setError(null);
      const response = await ordersAPI.removeItem(cart.id, itemId);
      setCart(response.data);
      return response.data;
    } catch (err) {
      console.error('Remove from cart error:', err);
      setError('Failed to remove item from cart');
      throw err;
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      if (!cart) {
        throw new Error('Cart not initialized');
      }
      
      setError(null);
      const response = await ordersAPI.updateItemQuantity(cart.id, itemId, quantity);
      setCart(response.data);
      return response.data;
    } catch (err) {
      console.error('Update quantity error:', err);
      setError('Failed to update item quantity');
      throw err;
    }
  };

  // Checkout cart
  const checkout = async (checkoutData) => {
    try {
      if (!cart) {
        throw new Error('Cart not initialized');
      }
      
      setError(null);
      const response = await ordersAPI.checkout(cart.id, checkoutData);
      
      // After checkout, mark as paid (simplified)
      await ordersAPI.markAsPaid(cart.id);
      
      // After checkout, fetch a new cart
      const newCartResponse = await ordersAPI.getCart();
      setCart(newCartResponse.data);
      
      return response.data;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to checkout');
      throw err;
    }
  };

  // Get cart item count
  const getItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    getItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}