// src/services/api.js
// Updated API service with Skills and Blog endpoints

import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
API.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Projects API endpoints
export const projectsAPI = {
  getAll: () => API.get('/projects'),
  getFeatured: () => API.get('/projects?featured=true'),
  getBySlug: (slug) => API.get(`/projects/${slug}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`)
};

// Skills API endpoints
export const skillsAPI = {
  getAll: (params = {}) => API.get('/skills', { params }),
  getFeatured: () => API.get('/skills?featured=true'),
  getByCategory: (category) => API.get(`/skills?category=${category}`),
  getCategories: () => API.get('/skills/categories'),
  getById: (id) => API.get(`/skills/${id}`),
  create: (data) => API.post('/skills', data),
  update: (id, data) => API.put(`/skills/${id}`, data),
  delete: (id) => API.delete(`/skills/${id}`)
};

// Blog API endpoints
export const blogAPI = {
  getAll: (params = {}) => API.get('/blog', { params }),
  getFeatured: () => API.get('/blog?featured=true'),
  getByCategory: (category) => API.get(`/blog?category=${category}`),
  getByTag: (tag) => API.get(`/blog?tag=${tag}`),
  getCategories: () => API.get('/blog/categories'),
  getTags: () => API.get('/blog/tags'),
  getBySlug: (slug) => API.get(`/blog/${slug}`),
  create: (data) => API.post('/blog', data),
  update: (id, data) => API.put(`/blog/${id}`, data),
  delete: (id) => API.delete(`/blog/${id}`)
};

// Health check
export const healthAPI = {
  check: () => API.get('/health')
};

export default API;