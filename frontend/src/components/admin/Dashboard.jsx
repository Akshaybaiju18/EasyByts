// src/components/admin/Dashboard.js
// Main dashboard with statistics and quick actions

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api-service';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [contentSummary, setContentSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, summaryResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getContentSummary()
      ]);

      setStats(statsResponse.data.data);
      setContentSummary(summaryResponse.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#6c757d' }}>Loading dashboard...</div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color = '#007bff', subtitle }) => (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '2rem',
        marginBottom: '0.5rem'
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: color,
        marginBottom: '0.5rem'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '1rem',
        color: '#333',
        marginBottom: subtitle ? '0.25rem' : '0'
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          fontSize: '0.85rem',
          color: '#6c757d'
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Welcome Section */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
          Welcome back! 👋
        </h2>
        <p style={{ color: '#6c757d', margin: 0 }}>
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Statistics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <StatCard
          title="Total Projects"
          value={stats?.overview?.projectsCount || 0}
          icon="💼"
          color="#007bff"
          subtitle={`${stats?.overview?.publishedProjects || 0} published`}
        />
        <StatCard
          title="Skills"
          value={stats?.overview?.skillsCount || 0}
          icon="🛠️"
          color="#28a745"
        />
        <StatCard
          title="Blog Posts"
          value={stats?.overview?.blogPostsCount || 0}
          icon="📝"
          color="#dc3545"
          subtitle={`${stats?.overview?.publishedPosts || 0} published`}
        />
        <StatCard
          title="Total Views"
          value={stats?.overview?.totalViews || 0}
          icon="👁️"
          color="#ffc107"
        />
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#2c3e50' }}>Quick Actions</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link
            to="/admin/projects/new"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              transition: 'background-color 0.3s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>➕</span>
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/blog/new"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>✏️</span>
            <span>Write Blog Post</span>
          </Link>
          <Link
            to="/admin/skills/new"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#17a2b8',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🔧</span>
            <span>Add Skill</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Recent Projects */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#2c3e50' }}>Recent Projects</h3>
          {contentSummary?.draftProjects?.length > 0 ? (
            <div>
              {contentSummary.draftProjects.slice(0, 5).map(project => (
                <div key={project._id} style={{
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #e9ecef'
                }}>
                  <div style={{ fontWeight: '500', color: '#333' }}>{project.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <Link
                to="/admin/projects"
                style={{
                  display: 'inline-block',
                  marginTop: '1rem',
                  color: '#007bff',
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                View all projects →
              </Link>
            </div>
          ) : (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
              No recent projects. <Link to="/admin/projects/new">Create your first project</Link>
            </p>
          )}
        </div>

        {/* Recent Blog Posts */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#2c3e50' }}>Recent Blog Posts</h3>
          {contentSummary?.draftPosts?.length > 0 ? (
            <div>
              {contentSummary.draftPosts.slice(0, 5).map(post => (
                <div key={post._id} style={{
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #e9ecef'
                }}>
                  <div style={{ fontWeight: '500', color: '#333' }}>{post.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                    Created {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <Link
                to="/admin/blog"
                style={{
                  display: 'inline-block',
                  marginTop: '1rem',
                  color: '#007bff',
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                View all posts →
              </Link>
            </div>
          ) : (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
              No recent posts. <Link to="/admin/blog/new">Write your first post</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;