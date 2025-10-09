// src/components/portfolio/Skills.js
// Skills showcase component with categories and proficiency levels

import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../../services/api-service';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [groupedSkills, setGroupedSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await skillsAPI.getAll({ status: 'active' });
      setSkills(response.data.data);
      setGroupedSkills(response.data.grouped);
      setError(null);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const categories = Object.keys(groupedSkills);
  const displaySkills = activeCategory === 'all' ? skills : groupedSkills[activeCategory] || [];

  const getSkillColor = (level) => {
    switch (level) {
      case 'Expert': return '#28a745';
      case 'Advanced': return '#007bff';
      case 'Intermediate': return '#ffc107';
      case 'Beginner': return '#6c757d';
      default: return '#007bff';
    }
  };

  const getProficiencyWidth = (proficiency) => {
    return Math.min(Math.max(proficiency, 10), 100);
  };

  if (loading) {
    return (
      <section className="skills" id="skills">
        <div className="container">
          <h2 className="section-title">My Skills</h2>
          <div className="loading">Loading skills...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="skills" id="skills">
        <div className="container">
          <h2 className="section-title">My Skills</h2>
          <div className="error">Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="skills" id="skills" style={{ padding: '4rem 0', backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <h2 className="section-title">My Skills</h2>

        {/* Category Filter */}
        <div className="skill-categories" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <button
            onClick={() => setActiveCategory('all')}
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            style={{
              padding: '0.5rem 1rem',
              border: activeCategory === 'all' ? '2px solid #007bff' : '2px solid #dee2e6',
              background: activeCategory === 'all' ? '#007bff' : 'white',
              color: activeCategory === 'all' ? 'white' : '#333',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            All Skills ({skills.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              style={{
                padding: '0.5rem 1rem',
                border: activeCategory === category ? '2px solid #007bff' : '2px solid #dee2e6',
                background: activeCategory === category ? '#007bff' : 'white',
                color: activeCategory === category ? 'white' : '#333',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {category} ({groupedSkills[category]?.length || 0})
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="skills-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {displaySkills.map(skill => (
            <div key={skill._id} className="skill-card" style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease'
            }}>
              <div className="skill-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 className="skill-name" style={{
                  margin: '0',
                  color: '#333',
                  fontSize: '1.1rem'
                }}>
                  {skill.icon && <span style={{ marginRight: '0.5rem' }}>{skill.icon}</span>}
                  {skill.name}
                </h3>
                <span 
                  className="skill-level"
                  style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getSkillColor(skill.level)
                  }}
                >
                  {skill.level}
                </span>
              </div>

              {skill.description && (
                <p style={{
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  {skill.description}
                </p>
              )}

              {/* Proficiency Bar */}
              <div className="proficiency-container" style={{ marginBottom: '1rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Proficiency</span>
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
                    width: `${getProficiencyWidth(skill.proficiency)}%`,
                    height: '100%',
                    backgroundColor: skill.color || '#007bff',
                    borderRadius: '4px',
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>
              </div>

              {/* Experience */}
              {skill.yearsOfExperience > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#6c757d',
                  fontSize: '0.9rem'
                }}>
                  <span>📅</span>
                  <span>{skill.experienceLevel} experience</span>
                </div>
              )}

              {/* Category Badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem'
              }}>
                <span style={{
                  padding: '0.3rem 0.8rem',
                  backgroundColor: '#e9ecef',
                  color: '#6c757d',
                  borderRadius: '15px',
                  fontSize: '0.8rem'
                }}>
                  {skill.category}
                </span>
                {skill.featured && (
                  <span style={{
                    color: '#ffc107',
                    fontSize: '1.2rem'
                  }}>⭐</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {displaySkills.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6c757d'
          }}>
            <p>No skills found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;