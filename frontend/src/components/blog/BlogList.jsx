// src/components/blog/BlogList.js
// Blog posts list component

import React, { useState, useEffect } from 'react';
import { blogAPI } from '../../services/api-service';
import BlogCard from './BlogCard';

const BlogList = ({ featured = false, limit, category, title = "Latest Blog Posts" }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [featured, limit, category]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};

      if (featured) params.featured = 'true';
      if (limit) params.limit = limit;
      if (category) params.category = category;

      const response = featured 
        ? await blogAPI.getFeatured()
        : await blogAPI.getAll(params);

      setPosts(response.data.data);
      setPagination({
        total: response.data.total,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="blog-list">
        <div className="container">
          <h2 className="section-title">{title}</h2>
          <div className="loading">Loading blog posts...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="blog-list">
        <div className="container">
          <h2 className="section-title">{title}</h2>
          <div className="error">Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-list" style={{ padding: '4rem 0' }}>
      <div className="container">
        <h2 className="section-title">{title}</h2>

        {posts.length > 0 ? (
          <div className="blog-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {posts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6c757d'
          }}>
            <p>No blog posts found.</p>
          </div>
        )}

        {/* Pagination Info */}
        {pagination.total > 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: '#6c757d'
          }}>
            <p>
              Showing {posts.length} of {pagination.total} posts
              {pagination.totalPages > 1 && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;