// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in when component mounts
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setCurrentUser(response.data);
      } catch (err) {
        console.log("User not logged in or session expired");
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      setCurrentUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || { error: 'Registration failed' });
      throw err;
    }
  };

  // Log in a user
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      setCurrentUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || { error: 'Login failed' });
      throw err;
    }
  };

  // Log out a user
  const logout = async () => {
    try {
      await authAPI.logout();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Check if user is a farmer
  const isFarmer = () => {
    return currentUser?.user_type === 'FARMER';
  };

  // Check if user is a buyer
  const isBuyer = () => {
    return currentUser?.user_type === 'BUYER';
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isFarmer,
    isBuyer,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}