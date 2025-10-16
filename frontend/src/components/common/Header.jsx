// src/components/common/Header.js
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
    <>
      <style>{headerStyles}</style>
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
                        className="admin-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        🎛️ Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <button
                        onClick={handleLogout}
                        className="logout-btn"
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
                      className="admin-login-link"
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
    </>
  );
};

const headerStyles = `
  /* Header Styles */
  .header {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 100%;
  }

  .header .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    position: relative;
  }

  /* Logo */
  .header .logo {
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
    z-index: 1001;
  }

  /* Navigation */
  .nav {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .nav-list {
    display: flex;
    list-style: none;
    gap: 0.5rem;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    list-style: none;
  }

  .nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: block;
  }

  .nav-link:hover {
    color: #007bff;
    background-color: rgba(0, 123, 255, 0.1);
  }

  .nav-link.active {
    color: #007bff;
    background-color: rgba(0, 123, 255, 0.1);
  }

  /* Admin Link */
  .admin-link {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white !important;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    display: inline-block;
  }

  .admin-link:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }

  /* Admin Login Link */
  .admin-login-link {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white !important;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    display: inline-block;
  }

  .admin-login-link:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }

  /* Logout Button */
  .logout-btn {
    background: none;
    border: 2px solid #dc3545;
    color: #dc3545;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .logout-btn:hover {
    background: #dc3545;
    color: white;
  }

  /* Mobile Menu Button */
  .mobile-menu-btn {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 1001;
  }

  .mobile-menu-btn span {
    width: 25px;
    height: 3px;
    background-color: #333;
    margin: 3px 0;
    transition: all 0.3s ease;
    display: block;
  }

  .mobile-menu-btn-open span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
  }

  .mobile-menu-btn-open span:nth-child(2) {
    opacity: 0;
  }

  .mobile-menu-btn-open span:nth-child(3) {
    transform: rotate(-45deg) translate(8px, -8px);
  }

  /* ============================================
     RESPONSIVE DESIGN
     ============================================ */

  /* Tablet and Mobile (768px and below) */
  @media screen and (max-width: 768px) {
    .header .container {
      padding: 0 15px;
    }

    .header-content {
      padding: 0.75rem 0;
    }

    .header .logo {
      font-size: 1.3rem;
    }

    .mobile-menu-btn {
      display: flex;
    }

    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      padding-top: 80px;
      overflow-y: auto;
    }

    .nav-open {
      transform: translateX(0);
    }

    .nav-list {
      flex-direction: column;
      gap: 0;
      width: 100%;
      padding: 1rem;
    }

    .nav-item {
      width: 100%;
      border-bottom: 1px solid #f0f0f0;
    }

    .nav-link {
      padding: 1rem;
      width: 100%;
      text-align: left;
      font-size: 1.1rem;
    }

    .admin-link,
    .admin-login-link {
      width: 90%;
      margin: 0.5rem auto;
      text-align: center;
      display: block;
    }

    .logout-btn {
      width: 90%;
      margin: 0.5rem auto;
      display: block;
    }
  }

  /* Mobile Small (480px and below) */
  @media screen and (max-width: 480px) {
    .header .container {
      padding: 0 12px;
    }

    .header .logo {
      font-size: 1.2rem;
    }

    .header-content {
      padding: 0.6rem 0;
    }

    .nav-link {
      font-size: 1rem;
      padding: 0.85rem;
    }

    .admin-link,
    .admin-login-link,
    .logout-btn {
      font-size: 0.85rem;
      padding: 0.6rem 1rem;
    }
  }

  /* Mobile Extra Small (360px and below) */
  @media screen and (max-width: 360px) {
    .header .logo {
      font-size: 1.1rem;
    }

    .mobile-menu-btn span {
      width: 22px;
    }
  }
`;

export default Header;