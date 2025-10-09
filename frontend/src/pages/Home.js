import React, { useState, useEffect } from 'react';
import Hero from '../components/portfolio/Hero';
import Projects from '../components/portfolio/Projects';
import Skills from '../components/portfolio/Skills';
import About from '../components/portfolio/About';
import BlogList from '../components/blog/BlogList';
import { projectsAPI } from '../services/api-service';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getFeatured();
      setProjects(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <Hero />
      <About />
      <Skills />
      <Projects 
        projects={projects} 
        loading={loading} 
        error={error}
        title="Featured Projects"
      />
      <BlogList 
        featured={true} 
        limit={3} 
        title="Latest Blog Posts" 
      />
    </div>
  );
};

export default Home;
