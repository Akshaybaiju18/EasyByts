// src/context/AuthContext.js
// Authentication context for managing user state

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api-service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('cms_token'));

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('cms_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.getCurrentUser();
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('cms_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { user: userData, token: userToken } = response.data.data;

      localStorage.setItem('cms_token', userToken);
      setToken(userToken);
      setUser(userData);

      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('cms_token');
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.data.user);
      return response.data.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const changePassword = async (passwords) => {
    try {
      await authAPI.changePassword(passwords);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    updateProfile,
    changePassword,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};