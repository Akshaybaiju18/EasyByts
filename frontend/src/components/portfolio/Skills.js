// src/components/portfolio/Skills.js
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
      <>
        <style>{skillsStyles}</style>
        <section className="skills" id="skills">
          <div className="container">
            <h2 className="section-title">My Skills</h2>
            <div className="loading">Loading skills...</div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{skillsStyles}</style>
        <section className="skills" id="skills">
          <div className="container">
            <h2 className="section-title">My Skills</h2>
            <div className="error">Error: {error}</div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{skillsStyles}</style>
      <section className="skills" id="skills">
        <div className="container">
          <h2 className="section-title">My Skills</h2>

          {/* Category Filter */}
          <div className="skill-categories">
            <button
              onClick={() => setActiveCategory('all')}
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            >
              All Skills ({skills.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              >
                {category} ({groupedSkills[category]?.length || 0})
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="skills-grid">
            {displaySkills.map(skill => (
              <div key={skill._id} className="skill-card">
                <div className="skill-header">
                  <h3 className="skill-name">
                    {skill.icon && <span className="skill-icon">{skill.icon}</span>}
                    {skill.name}
                  </h3>
                  <span 
                    className="skill-level"
                    style={{ backgroundColor: getSkillColor(skill.level) }}
                  >
                    {skill.level}
                  </span>
                </div>

                {skill.description && (
                  <p className="skill-description">
                    {skill.description}
                  </p>
                )}

                {/* Proficiency Bar */}
                <div className="proficiency-container">
                  <div className="proficiency-header">
                    <span className="proficiency-label">Proficiency</span>
                    <span 
                      className="proficiency-value"
                      style={{ color: skill.color || '#007bff' }}
                    >
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="proficiency-bar-bg">
                    <div 
                      className="proficiency-bar-fill"
                      style={{
                        width: `${getProficiencyWidth(skill.proficiency)}%`,
                        backgroundColor: skill.color || '#007bff'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Experience */}
                {skill.yearsOfExperience > 0 && (
                  <div className="skill-experience">
                    <span>📅</span>
                    <span>{skill.experienceLevel} experience</span>
                  </div>
                )}

                {/* Category Badge and Featured */}
                <div className="skill-footer">
                  <span className="category-badge">
                    {skill.category}
                  </span>
                  {skill.featured && (
                    <span className="featured-star">⭐</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {displaySkills.length === 0 && (
            <div className="no-skills">
              <p>No skills found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const skillsStyles = `
  .skills {
    padding: 4rem 0;
    background-color: #f8f9fa;
    width: 100%;
    overflow-x: hidden;
  }

  .skills .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #333;
    word-wrap: break-word;
  }

  /* Category Filter */
  .skill-categories {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .category-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #dee2e6;
    background: white;
    color: #333;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .category-btn.active {
    border-color: #007bff;
    background: #007bff;
    color: white;
  }

  .category-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
  }

  /* Skills Grid */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .skill-card {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .skill-card:hover {
    transform: translateY(-5px);
  }

  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .skill-name {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
    flex: 1;
    word-wrap: break-word;
  }

  .skill-icon {
    margin-right: 0.5rem;
  }

  .skill-level {
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: bold;
    color: white;
    white-space: nowrap;
  }

  .skill-description {
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.4;
    word-wrap: break-word;
  }

  .proficiency-container {
    margin-bottom: 1rem;
  }

  .proficiency-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .proficiency-label {
    font-size: 0.9rem;
    color: #6c757d;
  }

  .proficiency-value {
    font-size: 0.9rem;
    font-weight: bold;
  }

  .proficiency-bar-bg {
    width: 100%;
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
  }

  .proficiency-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 1s ease-out;
  }

  .skill-experience {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .skill-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .category-badge {
    padding: 0.3rem 0.8rem;
    background-color: #e9ecef;
    color: #6c757d;
    border-radius: 15px;
    font-size: 0.8rem;
  }

  .featured-star {
    color: #ffc107;
    font-size: 1.2rem;
  }

  .loading,
  .error {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
  }

  .error {
    color: #dc3545;
  }

  .loading {
    color: #6c757d;
  }

  .no-skills {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
  }

  /* ============================================
     RESPONSIVE DESIGN
     ============================================ */

  /* Tablet (768px and below) */
  @media screen and (max-width: 768px) {
    .skills {
      padding: 3rem 0;
    }

    .skills .container {
      padding: 0 15px;
    }

    .section-title {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    .skill-categories {
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .category-btn {
      font-size: 0.9rem;
      padding: 0.45rem 0.9rem;
    }

    .skills-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .skill-card {
      padding: 1.25rem;
    }
  }

  /* Mobile Large (600px and below) */
  @media screen and (max-width: 600px) {
    .skills {
      padding: 2.5rem 0;
    }

    .skills .container {
      padding: 0 12px;
    }

    .section-title {
      font-size: 1.75rem;
    }

    .skill-categories {
      gap: 0.6rem;
      margin-bottom: 1.75rem;
    }

    .category-btn {
      font-size: 0.85rem;
      padding: 0.4rem 0.8rem;
    }

    .skills-grid {
      gap: 1.25rem;
    }

    .skill-card {
      padding: 1.15rem;
      border-radius: 8px;
    }

    .skill-name {
      font-size: 1.05rem;
    }

    .skill-level {
      font-size: 0.75rem;
      padding: 0.25rem 0.7rem;
    }

    .skill-description {
      font-size: 0.85rem;
    }

    .proficiency-label,
    .proficiency-value {
      font-size: 0.85rem;
    }

    .skill-experience {
      font-size: 0.85rem;
    }

    .category-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.7rem;
    }

    .featured-star {
      font-size: 1.1rem;
    }
  }

  /* Mobile Small (480px and below) */
  @media screen and (max-width: 480px) {
    .skills {
      padding: 2rem 0;
    }

    .skills .container {
      padding: 0 10px;
    }

    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1.25rem;
    }

    .skill-categories {
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .category-btn {
      font-size: 0.8rem;
      padding: 0.35rem 0.7rem;
    }

    .skills-grid {
      gap: 1rem;
    }

    .skill-card {
      padding: 1rem;
    }

    .skill-name {
      font-size: 1rem;
    }

    .skill-level {
      font-size: 0.7rem;
      padding: 0.2rem 0.6rem;
    }

    .skill-description {
      font-size: 0.8rem;
      margin-bottom: 0.85rem;
    }

    .proficiency-container {
      margin-bottom: 0.85rem;
    }

    .proficiency-label,
    .proficiency-value {
      font-size: 0.8rem;
    }

    .proficiency-bar-bg {
      height: 6px;
    }

    .skill-experience {
      font-size: 0.8rem;
      margin-bottom: 0.85rem;
    }

    .category-badge {
      font-size: 0.7rem;
      padding: 0.2rem 0.6rem;
    }

    .featured-star {
      font-size: 1rem;
    }

    .loading,
    .error,
    .no-skills {
      font-size: 1rem;
      padding: 2rem 1rem;
    }
  }

  /* Mobile Extra Small (360px and below) */
  @media screen and (max-width: 360px) {
    .section-title {
      font-size: 1.35rem;
    }

    .skill-header {
      flex-wrap: wrap;
    }

    .skill-name {
      font-size: 0.95rem;
      flex-basis: 100%;
      margin-bottom: 0.5rem;
    }

    .skill-level {
      font-size: 0.65rem;
    }
  }
`;

export default Skills;