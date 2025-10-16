// src/components/portfolio/ProjectCard.js
import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <>
      <style>{projectCardStyles}</style>
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
    </>
  );
};

const projectCardStyles = `
  .project-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .project-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .project-image {
    height: 200px;
    overflow: hidden;
    width: 100%;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-image {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    font-size: 3rem;
  }

  .project-content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .project-title {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #333;
    word-wrap: break-word;
  }

  .project-description {
    color: #6c757d;
    margin-bottom: 1rem;
    line-height: 1.5;
    word-wrap: break-word;
    flex: 1;
  }

  .project-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tech-tag {
    background-color: #f8f9fa;
    color: #333;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .project-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .project-link {
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    flex: 1;
    min-width: 100px;
    text-align: center;
  }

  .demo-link {
    background-color: #007bff;
    color: white;
  }

  .demo-link:hover {
    background-color: #0056b3;
  }

  .github-link {
    background-color: #343a40;
    color: white;
  }

  .github-link:hover {
    background-color: #23272b;
  }

  /* ============================================
     RESPONSIVE DESIGN
     ============================================ */

  /* Mobile (600px and below) */
  @media screen and (max-width: 600px) {
    .project-card {
      border-radius: 6px;
    }

    .project-image {
      height: 180px;
    }

    .placeholder-image {
      font-size: 2.5rem;
    }

    .project-content {
      padding: 1.25rem;
    }

    .project-title {
      font-size: 1.15rem;
      margin-bottom: 0.4rem;
    }

    .project-description {
      font-size: 0.9rem;
      margin-bottom: 0.85rem;
    }

    .project-technologies {
      gap: 0.4rem;
      margin-bottom: 0.85rem;
    }

    .tech-tag {
      font-size: 0.8rem;
      padding: 0.25rem 0.65rem;
    }

    .project-links {
      flex-direction: column;
      gap: 0.6rem;
    }

    .project-link {
      width: 100%;
      flex: none;
      font-size: 0.85rem;
      padding: 0.6rem 1rem;
    }
  }

  /* Mobile Small (480px and below) */
  @media screen and (max-width: 480px) {
    .project-image {
      height: 160px;
    }

    .placeholder-image {
      font-size: 2.25rem;
    }

    .project-content {
      padding: 1rem;
    }

    .project-title {
      font-size: 1.05rem;
    }

    .project-description {
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }

    .tech-tag {
      font-size: 0.75rem;
      padding: 0.2rem 0.55rem;
    }

    .project-link {
      font-size: 0.8rem;
      padding: 0.55rem 0.85rem;
    }
  }
`;

export default ProjectCard;