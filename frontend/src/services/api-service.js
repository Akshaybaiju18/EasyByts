// Updated src/services/api.js with authentication endpoints

import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('cms_token');
      // Only redirect if we're in the admin area
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  logout: () => API.post('/auth/logout'),
  getCurrentUser: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data)
};

// Dashboard API endpoints
export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
  getContentSummary: () => API.get('/dashboard/content-summary')
};

// Projects API endpoints
export const projectsAPI = {
  getAll: (params = {}) => API.get('/projects', { params }),
  getFeatured: () => API.get('/projects?featured=true'),
  getBySlug: (slug) => API.get(`/projects/${slug}`),
  getById: (id) => API.get(`/projects/${id}`),
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
  getById: (id) => API.get(`/blog/${id}`),
  create: (data) => API.post('/blog', data),
  update: (id, data) => API.put(`/blog/${id}`, data),
  delete: (id) => API.delete(`/blog/${id}`)
};

// Health check
export const healthAPI = {
  check: () => API.get('/health')
};

export default API;