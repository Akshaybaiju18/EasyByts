// src/components/portfolio/ProjectCard.js
// Individual project card component

import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-image">
        {project.featuredImage ? (
          <img src={project.featuredImage} alt={project.title} />
        ) : (
          <div className="placeholder-image">
            <span>📁</span>
          </div>
        )}
      </div>

      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.shortDescription}</p>

        <div className="project-technologies">
          {project.technologies && project.technologies.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>

        <div className="project-links">
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link demo-link"
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link github-link"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
