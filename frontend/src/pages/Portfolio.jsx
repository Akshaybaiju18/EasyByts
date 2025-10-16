import React, { useState, useEffect } from 'react';
import Projects from '../components/portfolio/Projects';
import { projectsAPI } from '../services/api-service';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portfolio-page">
      <div className="container">
        <h1 className="page-title">My Portfolio</h1>
        <Projects 
          projects={projects} 
          loading={loading} 
          error={error}
          title="All Projects"
        />
      </div>
    </div>
  );
};

export default Portfolio;
