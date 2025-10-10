// src/components/admin/DashboardLayout.js
// Main dashboard layout with sidebar navigation

import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/projects', label: 'Projects', icon: '💼' },
    { path: '/admin/skills', label: 'Skills', icon: '🛠️' },
    { path: '/admin/blog', label: 'Blog Posts', icon: '📝' },
    { path: '/admin/profile', label: 'Profile', icon: '👤' }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '70px',
        background: '#2c3e50',
        color: 'white',
        transition: 'width 0.3s ease',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #34495e',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
          {sidebarOpen && (
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Portfolio CMS</h2>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1rem 0' }}>
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'white',
                textDecoration: 'none',
                backgroundColor: isActive(item.path) ? '#3498db' : 'transparent',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = '#34495e';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem', minWidth: '20px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        {sidebarOpen && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1rem',
            borderTop: '1px solid #34495e'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {user?.firstName?.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                  {user?.fullName}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#bdc3c7' }}>
                  {user?.role}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{
          background: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>
            {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Link
              to="/"
              target="_blank"
              style={{
                padding: '0.5rem 1rem',
                background: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}
            >
              View Site 🔗
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '2rem',
          background: '#f8f9fa',
          overflow: 'auto'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;