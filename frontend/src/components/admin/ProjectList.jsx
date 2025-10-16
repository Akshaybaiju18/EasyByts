// src/components/admin/ProjectList.js - FIXED VERSION

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api-service';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('🔍 Admin fetching ALL projects...');
      // ✅ FIXED: Get ALL projects for admin (including drafts)
      const response = await projectsAPI.getAll({ status: 'all' });
      console.log('✅ Admin received projects:', response.data.data.length);
      setProjects(response.data.data);
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId, projectTitle) => {
    if (!window.confirm(`Delete "${projectTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(projectId);
      await projectsAPI.delete(projectId);
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#28a745';
      case 'draft': return '#ffc107';
      case 'archived': return '#6c757d';
      default: return '#007bff';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div>Loading projects...</div>
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
        <h2 style={{ margin: 0 }}>Manage Projects ({projects.length})</h2>
        <Link
          to="/admin/projects/new"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          + Add New Project
        </Link>
      </div>

      {/* Projects Table */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                Project
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                Status
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                Technologies
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                Created
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map(project => (
                <tr key={project._id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                        {project.title}
                        {project.featured && (
                          <span style={{
                            marginLeft: '0.5rem',
                            padding: '0.2rem 0.5rem',
                            background: '#ffc107',
                            color: '#000',
                            borderRadius: '3px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        {project.shortDescription}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: 'white',
                      backgroundColor: getStatusColor(project.status)
                    }}>
                      {project.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {project.technologies?.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.2rem 0.5rem',
                            background: '#e9ecef',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            color: '#495057'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#6c757d', fontSize: '0.9rem' }}>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <Link
                        to={`/admin/projects/edit/${project._id}`}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: '#28a745',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '0.85rem'
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project._id, project.title)}
                        disabled={deleting === project._id}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: deleting === project._id ? '#6c757d' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          cursor: deleting === project._id ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {deleting === project._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>
                  No projects found. <Link to="/admin/projects/new">Create your first project</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
