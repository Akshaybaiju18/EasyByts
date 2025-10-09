import React from 'react';
import BlogList from '../components/blog/BlogList';

const Blog = () => {
  return (
    <div className="blog-page">
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '4rem 0'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>My Blog</h1>
          <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>
            Thoughts, tutorials, and insights on web development
          </p>
        </div>
      </div>
      
      <BlogList title="All Posts" />
    </div>
  );
};

export default Blog;
