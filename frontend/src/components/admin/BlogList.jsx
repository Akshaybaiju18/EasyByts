// src/components/admin/BlogList.js - FIXED VERSION

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../services/api-service';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('🔍 Admin fetching blog posts with filter:', filter);
      
      // ✅ FIXED: For admin, use 'all' to get everything
      const params = filter === 'all' ? { status: 'all' } : { status: filter };
      console.log('🔍 API params:', params);
      
      const response = await blogAPI.getAll(params);
      console.log('✅ Admin received blog posts:', response.data.data.length);
      setPosts(response.data.data);
    } catch (error) {
      console.error('❌ Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, postTitle) => {
    if (!window.confirm(`Delete "${postTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(postId);
      await blogAPI.delete(postId);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#28a745';
      case 'draft': return '#ffc107';
      case 'archived': return '#6c757d';
      default: return '#007bff';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': '#007bff',
      'React': '#61dafb',
      'Node.js': '#339933',
      'JavaScript': '#f7df1e',
      'CSS': '#1572b6',
      'Tutorial': '#28a745',
      'Career': '#6f42c1'
    };
    return colors[category] || '#6c757d';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div>Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>Manage Blog Posts ({posts.length})</h2>
        <Link
          to="/admin/blog/new"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          ✏️ Write New Post
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {['all', 'draft', 'published', 'archived'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '0.5rem 1rem',
                border: filter === status ? '2px solid #007bff' : '2px solid transparent',
                background: filter === status ? '#e3f2fd' : 'transparent',
                color: filter === status ? '#007bff' : '#6c757d',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: filter === status ? '500' : 'normal',
                textTransform: 'capitalize'
              }}
            >
              {status === 'all' ? 'All Posts' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem'
      }}>
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Featured Badge */}
              {post.featured && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#ffc107',
                  color: '#000',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  zIndex: 1
                }}>
                  ⭐ Featured
                </div>
              )}

              {/* Featured Image */}
              <div style={{
                height: '200px',
                background: post.featuredImage 
                  ? `url(${post.featuredImage})` 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem'
              }}>
                {!post.featuredImage && '📝'}
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                {/* Meta */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <span style={{
                    padding: '0.3rem 0.8rem',
                    backgroundColor: getStatusColor(post.status),
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {post.status}
                  </span>
                  <span style={{
                    padding: '0.3rem 0.8rem',
                    backgroundColor: getCategoryColor(post.category),
                    color: post.category === 'JavaScript' ? '#000' : 'white',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  margin: '0 0 0.75rem 0',
                  fontSize: '1.3rem',
                  lineHeight: '1.4'
                }}>
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p style={{
                  color: '#6c757d',
                  lineHeight: '1.5',
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    {post.tags.slice(0, 4).map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.25rem 0.6rem',
                          background: '#f8f9fa',
                          color: '#6c757d',
                          borderRadius: '10px',
                          fontSize: '0.8rem'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 4 && (
                      <span style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                        +{post.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e9ecef',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  color: '#6c757d'
                }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span>⏱️ {post.readTime || 5} min</span>
                    <span>👁️ {post.views || 0} views</span>
                    <span>❤️ {post.likes || 0} likes</span>
                  </div>
                  <div>
                    {post.publishedAt 
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()
                    }
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <Link
                    to={`/admin/blog/edit/${post._id}`}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      background: '#28a745',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '0.9rem'
                    }}
                  >
                    ✏️ Edit
                  </Link>
                  {post.status === 'published' && (
                    <Link
                      to={`/blog/${post.slug}`}
                      target="_blank"
                      style={{
                        flex: 1,
                        padding: '0.6rem',
                        background: '#17a2b8',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                      }}
                    >
                      👁️ View
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(post._id, post.title)}
                    disabled={deleting === post._id}
                    style={{
                      padding: '0.6rem 1rem',
                      background: deleting === post._id ? '#6c757d' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      cursor: deleting === post._id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {deleting === post._id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>No blog posts found</h3>
            <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
              {filter === 'all' 
                ? "You haven't written any blog posts yet." 
                : `No ${filter} posts found.`}
            </p>
            <Link
              to="/admin/blog/new"
              style={{
                padding: '0.75rem 2rem',
                background: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              ✏️ Write Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
