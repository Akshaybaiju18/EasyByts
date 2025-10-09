// src/components/portfolio/Projects.js
// Projects showcase component

import React from 'react';
import ProjectCard from './ProjectCard';

const Projects = ({ projects, loading, error, title = "My Projects" }) => {
  if (loading) {
    return (
      <section className="projects" id="projects">
        <div className="container">
          <h2 className="section-title">{title}</h2>
          <div className="loading">Loading projects...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="projects" id="projects">
        <div className="container">
          <h2 className="section-title">{title}</h2>
          <div className="error">Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="projects" id="projects">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="projects-grid">
          {projects.length > 0 ? (
            projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))
          ) : (
            <p className="no-projects">No projects found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
