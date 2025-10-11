// src/components/common/Header.js - SIMPLE VERSION using existing login page

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'nav-link active' : 'nav-link';
    }
    return location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link';
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            <span>Portfolio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={isActive('/')} onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/portfolio" className={isActive('/portfolio')} onClick={() => setIsMenuOpen(false)}>
                  Portfolio
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/blog" className={isActive('/blog')} onClick={() => setIsMenuOpen(false)}>
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className={isActive('/contact')} onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
              </li>

              {/* Admin Section */}
              {isAuthenticated && isAdmin ? (
                <>
                  <li className="nav-item">
                    <Link 
                      to="/admin" 
                      className="nav-link admin-link"
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      🎛️ Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'none',
                        border: '2px solid #dc3545',
                        color: '#dc3545',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#dc3545';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'none';
                        e.target.style.color = '#dc3545';
                      }}
                    >
                      👋 Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link
                    to="/admin/login?returnTo=home"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    🔐 Admin Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-btn ${isMenuOpen ? 'mobile-menu-btn-open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
