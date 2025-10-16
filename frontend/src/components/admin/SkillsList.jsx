// src/components/admin/SkillsList.js
// Admin skills management page

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillsAPI } from '../../services/api-service';

const SkillsList = () => {
  const [skills, setSkills] = useState([]);
  const [groupedSkills, setGroupedSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await skillsAPI.getAll();
      setSkills(response.data.data);
      setGroupedSkills(response.data.grouped || {});
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (skillId, skillName) => {
    if (!window.confirm(`Delete "${skillName}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(skillId);
      await skillsAPI.delete(skillId);
      setSkills(skills.filter(s => s._id !== skillId));
      // Update grouped skills
      const updatedGrouped = { ...groupedSkills };
      Object.keys(updatedGrouped).forEach(category => {
        updatedGrouped[category] = updatedGrouped[category].filter(s => s._id !== skillId);
      });
      setGroupedSkills(updatedGrouped);
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    } finally {
      setDeleting(null);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return '#28a745';
      case 'Advanced': return '#007bff';
      case 'Intermediate': return '#ffc107';
      case 'Beginner': return '#6c757d';
      default: return '#007bff';
    }
  };

  const categories = Object.keys(groupedSkills);
  const displaySkills = activeCategory === 'all' ? skills : groupedSkills[activeCategory] || [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div>Loading skills...</div>
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
        <h2 style={{ margin: 0 }}>Manage Skills</h2>
        <Link
          to="/admin/skills/new"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          + Add New Skill
        </Link>
      </div>

      {/* Category Filter */}
      <div style={{
        background: 'white',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Filter by Category:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '0.5rem 1rem',
              border: activeCategory === 'all' ? '2px solid #007bff' : '2px solid #dee2e6',
              background: activeCategory === 'all' ? '#007bff' : 'white',
              color: activeCategory === 'all' ? 'white' : '#333',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            All Skills ({skills.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '0.5rem 1rem',
                border: activeCategory === category ? '2px solid #007bff' : '2px solid #dee2e6',
                background: activeCategory === category ? '#007bff' : 'white',
                color: activeCategory === category ? 'white' : '#333',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              {category} ({groupedSkills[category]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {displaySkills.length > 0 ? (
          displaySkills.map(skill => (
            <div key={skill._id} style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              position: 'relative'
            }}>
              {/* Featured Badge */}
              {skill.featured && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#ffc107',
                  color: '#000',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  ⭐ Featured
                </div>
              )}

              {/* Skill Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0', fontSize: '1.2rem' }}>
                    {skill.icon && <span style={{ marginRight: '0.5rem' }}>{skill.icon}</span>}
                    {skill.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      background: '#e9ecef',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      color: '#495057'
                    }}>
                      {skill.category}
                    </span>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      backgroundColor: getLevelColor(skill.level),
                      color: 'white',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {skill.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {skill.description && (
                <p style={{
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  marginBottom: '1rem'
                }}>
                  {skill.description}
                </p>
              )}

              {/* Proficiency Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Proficiency</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: skill.color || '#007bff' }}>
                    {skill.proficiency}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${skill.proficiency}%`,
                    height: '100%',
                    backgroundColor: skill.color || '#007bff',
                    borderRadius: '4px'
                  }}></div>
                </div>
              </div>

              {/* Experience */}
              {skill.yearsOfExperience > 0 && (
                <div style={{
                  fontSize: '0.9rem',
                  color: '#6c757d',
                  marginBottom: '1rem'
                }}>
                  📅 {skill.yearsOfExperience}+ years experience
                </div>
              )}

              {/* Actions */}
              <div style={{
                borderTop: '1px solid #e9ecef',
                paddingTop: '1rem',
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'flex-end'
              }}>
                <Link
                  to={`/admin/skills/edit/${skill._id}`}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(skill._id, skill.name)}
                  disabled={deleting === skill._id}
                  style={{
                    padding: '0.5rem 1rem',
                    background: deleting === skill._id ? '#6c757d' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    cursor: deleting === skill._id ? 'not-allowed' : 'pointer'
                  }}
                >
                  {deleting === skill._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ color: '#6c757d', marginBottom: '1rem' }}>
              No skills found in this category.
            </div>
            <Link
              to="/admin/skills/new"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
            >
              Add Your First Skill
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsList;