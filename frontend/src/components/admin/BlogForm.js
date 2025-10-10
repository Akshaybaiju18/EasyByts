// src/components/admin/BlogForm.js
// Blog create/edit form

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogAPI } from '../../services/api-service';

const BlogForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Web Development',
    tags: '',
    featuredImage: '',
    status: 'draft',
    featured: false,
    author: {
      name: 'Your Name',
      email: 'your.email@example.com'
    }
  });

  const categories = [
    'Web Development', 'React', 'Node.js', 'JavaScript', 'CSS',
    'Database', 'DevOps', 'Mobile Development', 'UI/UX Design',
    'Career', 'Tutorial', 'Opinion', 'Review'
  ];

  useEffect(() => {
    if (isEdit && id) {
      fetchPost();
    }
  }, [isEdit, id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getById(id);
      const post = response.data.data;

      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        category: post.category || 'Web Development',
        tags: post.tags?.join(', ') || '',
        featuredImage: post.featuredImage || '',
        status: post.status || 'draft',
        featured: post.featured || false,
        author: {
          name: post.author?.name || 'Your Name',
          email: post.author?.email || 'your.email@example.com'
        }
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('author.')) {
      const authorField = name.split('.')[1];
      setFormData({
        ...formData,
        author: {
          ...formData.author,
          [authorField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare data
      const submitData = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim().toLowerCase())
          .filter(tag => tag.length > 0)
      };

      if (isEdit) {
        await blogAPI.update(id, submitData);
      } else {
        await blogAPI.create(submitData);
      }

      alert(`Blog post ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Failed to ${isEdit ? 'update' : 'create'} post`);
    } finally {
      setSaving(false);
    }
  };

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div>Loading post...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>
          {isEdit ? 'Edit Blog Post' : 'Write New Blog Post'}
        </h2>
        <button
          onClick={() => navigate('/admin/blog')}
          style={{
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Posts
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem'
      }}>
        {/* Main Content */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {/* Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Post Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1.1rem',
                fontWeight: '500'
              }}
              placeholder="Enter your blog post title"
            />
          </div>

          {/* Excerpt */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              maxLength={300}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Brief description that appears in post previews"
            />
            <small style={{ color: '#6c757d' }}>
              {formData.excerpt.length}/300 characters
            </small>
          </div>

          {/* Content */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={20}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'Monaco, "Courier New", monospace',
                lineHeight: '1.6',
                resize: 'vertical'
              }}
              placeholder="Write your blog post content here... 

You can use Markdown syntax:

# Heading 1
## Heading 2

**bold text**
*italic text*

- List item
- Another item

\`inline code\`

\`\`\`javascript
// Code block
function example() {
  console.log('Hello, World!');
}
\`\`\`

[Link text](https://example.com)
"
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.85rem', 
              color: '#6c757d',
              marginTop: '0.5rem'
            }}>
              <span>
                {formData.content.split(/\s+/).length} words
              </span>
              <span>
                ~{calculateReadingTime(formData.content)} min read
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Publish Settings */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Publish Settings</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px'
                }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                style={{ transform: 'scale(1.2)' }}
              />
              <label htmlFor="featured" style={{ fontWeight: '500', cursor: 'pointer' }}>
                Featured Post
              </label>
            </div>
          </div>

          {/* Category & Tags */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Category & Tags</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px'
                }}
                placeholder="react, javascript, tutorial"
              />
              <small style={{ color: '#6c757d' }}>
                Separate tags with commas
              </small>
            </div>
          </div>

          {/* Featured Image */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Featured Image</h3>

            <input
              type="url"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                marginBottom: '0.5rem'
              }}
              placeholder="https://images.unsplash.com/..."
            />

            {formData.featuredImage && (
              <div style={{
                marginTop: '0.5rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Author */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Author</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Name
              </label>
              <input
                type="text"
                name="author.name"
                value={formData.author.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email
              </label>
              <input
                type="email"
                name="author.email"
                value={formData.author.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: saving ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Saving...' : (isEdit ? 'Update Post' : 'Create Post')}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/blog')}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'transparent',
                  color: '#6c757d',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;