// src/components/portfolio/Projects.js
import React from 'react';
import ProjectCard from './ProjectCard';

const Projects = ({ projects, loading, error, title = "My Projects" }) => {
  if (loading) {
    return (
      <>
        <style>{projectsStyles}</style>
        <section className="projects" id="projects">
          <div className="container">
            <h2 className="section-title">{title}</h2>
            <div className="loading">Loading projects...</div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{projectsStyles}</style>
        <section className="projects" id="projects">
          <div className="container">
            <h2 className="section-title">{title}</h2>
            <div className="error">Error: {error}</div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{projectsStyles}</style>
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
    </>
  );
};

const projectsStyles = `
  .projects {
    padding: 4rem 0;
    width: 100%;
    overflow-x: hidden;
  }

  .projects .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
    word-wrap: break-word;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
    color: #6c757d;
  }

  .error {
    text-align: center;
    padding: 2rem;
    color: #dc3545;
    font-size: 1.1rem;
  }

  .no-projects {
    text-align: center;
    color: #6c757d;
    font-size: 1.1rem;
    grid-column: 1 / -1;
    padding: 2rem;
  }

  /* ============================================
     RESPONSIVE DESIGN
     ============================================ */

  /* Tablet (768px and below) */
  @media screen and (max-width: 768px) {
    .projects {
      padding: 3rem 0;
    }

    .projects .container {
      padding: 0 15px;
    }

    .section-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .projects-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  /* Mobile Large (600px and below) */
  @media screen and (max-width: 600px) {
    .projects {
      padding: 2.5rem 0;
    }

    .projects .container {
      padding: 0 12px;
    }

    .section-title {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
    }

    .projects-grid {
      gap: 1.25rem;
    }

    .loading,
    .error,
    .no-projects {
      font-size: 1rem;
      padding: 1.5rem;
    }
  }

  /* Mobile Small (480px and below) */
  @media screen and (max-width: 480px) {
    .projects {
      padding: 2rem 0;
    }

    .projects .container {
      padding: 0 10px;
    }

    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1.25rem;
    }

    .projects-grid {
      gap: 1rem;
    }

    .loading,
    .error,
    .no-projects {
      font-size: 0.95rem;
      padding: 1.25rem;
    }
  }

  /* Mobile Extra Small (360px and below) */
  @media screen and (max-width: 360px) {
    .section-title {
      font-size: 1.35rem;
    }
  }
`;

export default Projects;