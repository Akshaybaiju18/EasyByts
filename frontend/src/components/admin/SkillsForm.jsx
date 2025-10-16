// src/components/admin/SkillsForm.js
// Skills create/edit form

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { skillsAPI } from '../../services/api-service';

const SkillsForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 'Intermediate',
    proficiency: 50,
    description: '',
    yearsOfExperience: 0,
    icon: '',
    color: '#007bff',
    featured: false,
    status: 'active'
  });

  const categories = [
    'Frontend', 'Backend', 'Database', 'DevOps', 
    'Mobile', 'Design', 'Tools', 'Soft Skills', 'Languages'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    if (isEdit && id) {
      fetchSkill();
    }
  }, [isEdit, id]);

  const fetchSkill = async () => {
    try {
      setLoading(true);
      const response = await skillsAPI.getById(id);
      const skill = response.data.data;

      setFormData({
        name: skill.name || '',
        category: skill.category || 'Frontend',
        level: skill.level || 'Intermediate',
        proficiency: skill.proficiency || 50,
        description: skill.description || '',
        yearsOfExperience: skill.yearsOfExperience || 0,
        icon: skill.icon || '',
        color: skill.color || '#007bff',
        featured: skill.featured || false,
        status: skill.status || 'active'
      });
    } catch (error) {
      console.error('Error fetching skill:', error);
      alert('Failed to load skill');
      navigate('/admin/skills');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        await skillsAPI.update(id, formData);
      } else {
        await skillsAPI.create(formData);
      }

      alert(`Skill ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/admin/skills');
    } catch (error) {
      console.error('Error saving skill:', error);
      alert(`Failed to ${isEdit ? 'update' : 'create'} skill`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div>Loading skill...</div>
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
          {isEdit ? 'Edit Skill' : 'Add New Skill'}
        </h2>
        <button
          onClick={() => navigate('/admin/skills')}
          style={{
            padding: '0.5rem 1rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Skills
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Skill Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="e.g., React, Node.js, Python"
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Skill Level *
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Proficiency */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Proficiency: {formData.proficiency}%
            </label>
            <input
              type="range"
              name="proficiency"
              value={formData.proficiency}
              onChange={handleChange}
              min="1"
              max="100"
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '5px',
                background: '#e9ecef',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6c757d' }}>
              <span>1%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Years of Experience */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Years of Experience
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              min="0"
              max="50"
              step="0.5"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="0"
            />
          </div>

          {/* Icon */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Icon (Emoji)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="⚛️ 🟨 🟢 💻"
            />
            <small style={{ color: '#6c757d' }}>
              Add an emoji or icon to represent this skill
            </small>
          </div>

          {/* Color */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Color
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                height: '3rem'
              }}
            />
          </div>

          {/* Status */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="active">Active</option>
              <option value="learning">Learning</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Description */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Brief description of your experience with this skill"
            />
          </div>

          {/* Featured */}
          <div style={{
            gridColumn: '1 / -1',
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
              Featured Skill (show prominently)
            </label>
          </div>
        </div>

        {/* Preview */}
        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>Preview:</h4>
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>{formData.icon || '🔧'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {formData.name || 'Skill Name'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                {formData.category} • {formData.level} • {formData.yearsOfExperience}+ years
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, maxWidth: '200px' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${formData.proficiency}%`,
                      height: '100%',
                      backgroundColor: formData.color,
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: formData.color }}>
                  {formData.proficiency}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{
          borderTop: '1px solid #e9ecef',
          paddingTop: '2rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={() => navigate('/admin/skills')}
            style={{
              padding: '0.75rem 2rem',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.75rem 2rem',
              background: saving ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            {saving ? 'Saving...' : (isEdit ? 'Update Skill' : 'Create Skill')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillsForm;