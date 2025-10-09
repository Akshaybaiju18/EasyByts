// src/components/blog/BlogCard.js
// Individual blog post card component

import React from 'react';

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': '#007bff',
      'React': '#61dafb',
      'Node.js': '#339933',
      'JavaScript': '#f7df1e',
      'CSS': '#1572b6',
      'Database': '#336791',
      'DevOps': '#ff6b35',
      'Tutorial': '#28a745',
      'Career': '#6f42c1',
      'Opinion': '#fd7e14'
    };
    return colors[category] || '#6c757d';
  };

  return (
    <article className="blog-card" style={{
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    }}>

      {/* Featured Image */}
      <div className="blog-image" style={{
        height: '200px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {post.featuredImage ? (
          <img 
            src={post.featuredImage} 
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem'
          }}>
            📝
          </div>
        )}

        {/* Featured Badge */}
        {post.featured && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#ffc107',
            color: '#000',
            padding: '0.3rem 0.8rem',
            borderRadius: '15px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="blog-content" style={{ padding: '1.5rem' }}>

        {/* Meta Information */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: '#6c757d'
        }}>
          <span>📅 {formatDate(post.publishedAt)}</span>
          <span>⏱️ {post.readTime} min read</span>
          <span>👁️ {post.views} views</span>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-block',
            padding: '0.3rem 0.8rem',
            backgroundColor: getCategoryColor(post.category),
            color: 'white',
            borderRadius: '15px',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.3rem',
          lineHeight: '1.4',
          color: '#333'
        }}>
          <a 
            href={`/blog/${post.slug}`}
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
            onMouseEnter={(e) => e.target.style.color = '#007bff'}
            onMouseLeave={(e) => e.target.style.color = '#333'}
          >
            {post.title}
          </a>
        </h3>

        {/* Excerpt */}
        <p style={{
          color: '#6c757d',
          lineHeight: '1.6',
          marginBottom: '1rem'
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
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                style={{
                  padding: '0.2rem 0.6rem',
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span style={{
                color: '#6c757d',
                fontSize: '0.75rem'
              }}>
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Author & Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e9ecef'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {post.author.avatar ? (
              <img 
                src={post.author.avatar}
                alt={post.author.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#007bff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {post.author.name.charAt(0)}
              </div>
            )}
            <span style={{
              fontSize: '0.9rem',
              color: '#6c757d'
            }}>
              {post.author.name}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#6c757d'
          }}>
            <span>❤️ {post.likes}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;