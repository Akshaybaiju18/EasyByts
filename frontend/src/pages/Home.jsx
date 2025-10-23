import React, { useState, useEffect } from 'react';
import Hero from '../components/portfolio/Hero';
import Projects from '../components/portfolio/Projects';
import Skills from '../components/portfolio/Skills';
import About from '../components/portfolio/About';
import BlogList from '../components/blog/BlogList';
import { projectsAPI } from '../services/api-service';
import API from '../services/api-service';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
    fetchFeaturedProjects();
  }, []);

  const fetchProfileData = async () => {
    try {
      setProfileLoading(true);
      const response = await API.get('/profile');
      setProfile(response.data.data);
    } catch (err) {
      setProfile({
        firstName: 'Your',
        lastName: 'Name',
        title: 'Full Stack Developer',
        tagline: 'Welcome to my portfolio',
        aboutMe: 'This is where your about section will appear once you update your profile.',
        email: 'your.email@example.com',
        location: { city: 'Your City', country: 'Your Country' },
        socialLinks: {},
        profileImage: '',
        isAvailable: true,
        yearsOfExperience: 0
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll({ 
        status: 'published', 
        featured: 'true' 
      });
      setProjects(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="home-page">
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fa'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid #e9ecef',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: '#6c757d' }}>Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills profile={profile} />
      <Projects
        projects={projects}
        loading={loading}
        error={error}
        title="Featured Projects"
        profile={profile}
      />
      <BlogList
        featured={true}
        limit={3}
        title="Latest Blog Posts"
        showAuthor={true}
        profile={profile}
      />

      {/* Contact Section with Profile Data */}
      {profile && (
        <section
          className="contact-preview"
          style={{
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <div
            className="contact-container"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 className="contact-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Let's Work Together
            </h2>

            {profile.isAvailable && (
              <div
                className="availability-badge"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '1rem 2rem',
                  borderRadius: '25px',
                  display: 'inline-block',
                  marginBottom: '2rem'
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                  ✅ {profile.availabilityMessage || 'Available for new opportunities'}
                </span>
              </div>
            )}

            <p
              className="contact-description"
              style={{
                fontSize: '1.2rem',
                marginBottom: '2rem',
                opacity: 0.9
              }}
            >
              {profile.shortBio || `Have a project in mind? Let's discuss how we can work together.`}
            </p>

            <div
              className="contact-info-grid"
              style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '2rem'
              }}
            >
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="contact-link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={e => (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
                  onMouseLeave={e => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
                >
                  📧 <span className="contact-text">{profile.email}</span>
                </a>
              )}

              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="contact-link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={e => (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
                  onMouseLeave={e => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
                >
                  📱 <span className="contact-text">{profile.phone}</span>
                </a>
              )}

              {profile.formattedLocation && (
                <div
                  className="contact-link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1.1rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px'
                  }}
                >
                  📍 <span className="contact-text">{profile.formattedLocation}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div
              className="social-links-grid"
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.5rem',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={e => (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
                  onMouseLeave={e => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
                >
                  💻
                </a>
              )}

              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.5rem',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={e => (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
                  onMouseLeave={e => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
                >
                  💼
                </a>
              )}

              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.5rem',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={e => (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
                  onMouseLeave={e => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
                >
                  🐦
                </a>
              )}

              {profile.socialLinks?.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1.5rem',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={e => (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
                  onMouseLeave={e => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
                >
                  🌐
                </a>
              )}
            </div>

            {/* Resume Download */}
            {profile.resumeUrl && (
              <div style={{ marginTop: '2rem' }}>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-button"
                  style={{
                    display: 'inline-block',
                    padding: '1rem 2rem',
                    background: 'white',
                    color: '#667eea',
                    textDecoration: 'none',
                    borderRadius: '30px',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={e => (e.target.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.target.style.transform = 'scale(1)')}
                >
                  📄 Download Resume
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .contact-preview {
            padding: 2rem 1rem !important;
          }
          
          .contact-title {
            font-size: 1.75rem !important;
          }
          
          .availability-badge {
            padding: 0.75rem 1.5rem !important;
            margin-bottom: 1.5rem !important;
          }
          
          .availability-badge span {
            font-size: 0.95rem !important;
          }
          
          .contact-description {
            font-size: 1rem !important;
            padding: 0 0.5rem;
          }
          
          .contact-info-grid {
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: stretch !important;
          }
          
          .contact-link {
            font-size: 0.95rem !important;
            padding: 0.75rem 1rem !important;
            justify-content: center !important;
          }
          
          .contact-text {
            font-size: 0.9rem;
            word-break: break-word;
          }
          
          .social-links-grid {
            gap: 0.75rem !important;
          }
          
          .social-icon {
            width: 45px !important;
            height: 45px !important;
            font-size: 1.3rem !important;
          }
          
          .resume-button {
            font-size: 1rem !important;
            padding: 0.875rem 1.75rem !important;
          }
        }

        @media (max-width: 480px) {
          .contact-title {
            font-size: 1.5rem !important;
          }
          
          .contact-link {
            font-size: 0.85rem !important;
          }
          
          .contact-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;