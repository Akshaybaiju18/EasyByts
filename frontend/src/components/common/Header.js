// src/components/common/Header.js
// Navigation header component

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text">Portfolio</span>
          </Link>

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
  </ul>
</nav>


          <button 
            className={`menu-toggle ${isMenuOpen ? 'menu-open' : ''}`}
            onClick={toggleMenu}
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
