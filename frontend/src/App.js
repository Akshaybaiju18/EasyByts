// Updated src/App.js with admin routes

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

import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
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
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin={true}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard routes will be nested here */}
              <Route index element={<Dashboard />} />
              {/* Add more admin routes here as we build them */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;