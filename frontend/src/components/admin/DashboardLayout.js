// src/components/admin/DashboardLayout.js
// Enhanced dashboard layout with messages, notifications, and better UX

import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api-service';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchUnreadMessagesCount();
    fetchUserProfile();
  }, []);

  const fetchUnreadMessagesCount = async () => {
    try {
      const response = await API.get('/contact/admin', { 
        params: { isRead: 'false', limit: 1 } 
      });
      setUnreadMessagesCount(response.data.stats?.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await API.get('/profile/admin');
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const menuItems = [
    { 
      path: '/admin', 
      label: 'Dashboard', 
      icon: '📊',
      description: 'Overview & Statistics'
    },
    { 
      path: '/admin/projects', 
      label: 'Projects', 
      icon: '💼',
      description: 'Manage Portfolio Projects'
    },
    { 
      path: '/admin/skills', 
      label: 'Skills', 
      icon: '🛠️',
      description: 'Technical Skills'
    },
    { 
      path: '/admin/blog', 
      label: 'Blog Posts', 
      icon: '📝',
      description: 'Write & Publish Articles'
    },
    { 
      path: '/admin/messages', 
      label: 'Messages', 
      icon: '📬',
      description: 'Contact Form Submissions',
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null
    },
    { 
      path: '/admin/profile', 
      label: 'Profile', 
      icon: '👤',
      description: 'Personal Information'
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const getCurrentPageInfo = () => {
    const currentItem = menuItems.find(item => isActive(item.path));
    return currentItem || { label: 'Dashboard', description: 'Portfolio Management' };
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '70px',
        background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        transition: 'width 0.3s ease',
        position: 'relative',
        boxShadow: '4px 0 15px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            ☰
          </button>
          {sidebarOpen && (
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.2rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #3498db, #e74c3c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Portfolio CMS
              </h2>
              <p style={{ 
                margin: '0.25rem 0 0 0', 
                fontSize: '0.8rem', 
                color: '#bdc3c7',
                fontWeight: '400'
              }}>
                Admin Dashboard
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1rem 0', flex: 1 }}>
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: sidebarOpen ? '0.75rem 1rem' : '0.75rem',
                margin: '0.25rem 0.5rem',
                color: 'white',
                textDecoration: 'none',
                backgroundColor: isActive(item.path) 
                  ? 'rgba(52, 152, 219, 0.8)' 
                  : 'transparent',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ 
                fontSize: '1.2rem', 
                minWidth: '24px',
                textAlign: 'center'
              }}>
                {item.icon}
              </span>
              
              {sidebarOpen && (
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '0.95rem',
                    fontWeight: isActive(item.path) ? '600' : '500',
                    marginBottom: '0.1rem'
                  }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem',
                    color: isActive(item.path) ? 'rgba(255,255,255,0.9)' : '#bdc3c7',
                    lineHeight: '1.2'
                  }}>
                    {item.description}
                  </div>
                </div>
              )}

              {/* Badge for unread messages */}
              {item.badge && (
                <span style={{
                  position: sidebarOpen ? 'static' : 'absolute',
                  top: sidebarOpen ? 'auto' : '0.5rem',
                  right: sidebarOpen ? 'auto' : '0.5rem',
                  minWidth: '20px',
                  height: '20px',
                  background: '#e74c3c',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.1)'
        }}>
          {sidebarOpen ? (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: profile?.profileImage 
                    ? `url(${profile.profileImage})` 
                    : 'linear-gradient(135deg, #3498db, #2980b9)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}>
                  {!profile?.profileImage && (user?.firstName?.charAt(0) || 'A')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: '600',
                    marginBottom: '0.2rem'
                  }}>
                    {profile?.firstName && profile?.lastName 
                      ? `${profile.firstName} ${profile.lastName}`
                      : user?.fullName || 'Admin User'
                    }
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#bdc3c7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>👑 {user?.role || 'Administrator'}</span>
                    {profile?.isAvailable && (
                      <span style={{
                        width: '6px',
                        height: '6px',
                        background: '#2ecc71',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}></span>
                    )}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to="/admin/profile"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >
                  ⚙️ Settings
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                  onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: profile?.profileImage 
                  ? `url(${profile.profileImage})` 
                  : 'linear-gradient(135deg, #3498db, #2980b9)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.2)',
                margin: '0 auto 0.5rem'
              }}>
                {!profile?.profileImage && (user?.firstName?.charAt(0) || 'A')}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
                title="Logout"
              >
                🚪
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{
          background: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e9ecef'
        }}>
          <div>
            <h1 style={{ 
              margin: '0 0 0.25rem 0', 
              color: '#2c3e50',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              {getCurrentPageInfo().label}
            </h1>
            <p style={{ 
              margin: 0, 
              color: '#6c757d', 
              fontSize: '0.9rem'
            }}>
              {getCurrentPageInfo().description}
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Notifications */}
            {unreadMessagesCount > 0 && (
              <Link
                to="/admin/messages"
                style={{
                  position: 'relative',
                  padding: '0.5rem',
                  background: '#fff3cd',
                  color: '#856404',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  border: '1px solid #ffeaa7',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                📬 {unreadMessagesCount} new message{unreadMessagesCount !== 1 ? 's' : ''}
              </Link>
            )}

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/"
                target="_blank"
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 10px rgba(40, 167, 69, 0.3)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                🌐 View Site
              </Link>
              
              <Link
                to="/admin/profile"
                style={{
                  padding: '0.5rem',
                  background: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e9ecef'}
                onMouseLeave={(e) => e.target.style.background = '#f8f9fa'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: profile?.profileImage 
                    ? `url(${profile.profileImage})` 
                    : 'linear-gradient(135deg, #6c757d, #495057)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {!profile?.profileImage && (user?.firstName?.charAt(0) || 'A')}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '2rem',
          background: '#f8f9fa',
          overflow: 'auto',
          position: 'relative'
        }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          style={{
            display: window.innerWidth <= 768 ? 'block' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Global Styles */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-layout {
            flex-direction: column;
          }
          .sidebar {
            position: fixed;
            z-index: 1001;
            height: 100vh;
          }
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
