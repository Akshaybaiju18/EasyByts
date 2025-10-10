// src/App.js
// Complete App with all admin routes

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

// Admin components
import Login from './components/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import DashboardLayout from './components/admin/DashboardLayout';
import Dashboard from './components/admin/Dashboard';

// Project management
import ProjectList from './components/admin/ProjectList';
import ProjectForm from './components/admin/ProjectForm';

// Skills management
import SkillsList from './components/admin/SkillsList';
import SkillsForm from './components/admin/SkillsForm';

// Blog management
import BlogList from './components/admin/BlogList';
import BlogForm from './components/admin/BlogForm';

import './styles/global.css';

// Add CSS for loading animation
const loadingStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = loadingStyles;
  document.head.appendChild(style);
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={
              <>
                <Header />
                <main className="main-content">
                  <Home />
                </main>
                <Footer />
              </>
            } />

            <Route path="/portfolio" element={
              <>
                <Header />
                <main className="main-content">
                  <Portfolio />
                </main>
                <Footer />
              </>
            } />

            <Route path="/blog" element={
              <>
                <Header />
                <main className="main-content">
                  <Blog />
                </main>
                <Footer />
              </>
            } />

            <Route path="/contact" element={
              <>
                <Header />
                <main className="main-content">
                  <Contact />
                </main>
                <Footer />
              </>
            } />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard Home */}
              <Route index element={<Dashboard />} />

              {/* Projects Management */}
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/edit/:id" element={<ProjectForm isEdit={true} />} />

              {/* Skills Management */}
              <Route path="skills" element={<SkillsList />} />
              <Route path="skills/new" element={<SkillsForm />} />
              <Route path="skills/edit/:id" element={<SkillsForm isEdit={true} />} />

              {/* Blog Management */}
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/new" element={<BlogForm />} />
              <Route path="blog/edit/:id" element={<BlogForm isEdit={true} />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background: '#f8f9fa'
              }}>
                <div>
                  <h1 style={{ fontSize: '4rem', margin: '0', color: '#6c757d' }}>404</h1>
                  <p style={{ fontSize: '1.2rem', margin: '1rem 0', color: '#6c757d' }}>Page not found</p>
                  <a href="/" style={{
                    padding: '0.75rem 1.5rem',
                    background: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px'
                  }}>
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;