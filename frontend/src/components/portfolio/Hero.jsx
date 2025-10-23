// src/components/portfolio/Hero.js
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ profile }) => {
  if (!profile) {
    return (
      <>
        <style>{heroStyles}</style>
        <section className="hero hero-loading">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{heroStyles}</style>
      <section className="hero">
        <div className="hero-container">
          {/* Left Content */}
          <div className="hero-content">
            <h1 className="hero-title">
              {profile.firstName} {profile.lastName}
            </h1>
            
            <h2 className="hero-subtitle">
              {profile.title}
            </h2>
            
            {profile.tagline && (
              <p className="hero-description">
                {profile.tagline}
              </p>
            )}
            
            <div className="hero-buttons">
              <Link to="/contact" className="hero-btn hero-btn-primary">
                Get In Touch
              </Link>
              
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn hero-btn-secondary"
                >
                  📄 Download Resume
                </a>
              )}
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="hero-image-wrapper">
            <div className="hero-image-container">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  👤
                </div>
              )}
              
              {/* Decorative elements */}
              <div className="decorative-circle decorative-circle-1"></div>
              <div className="decorative-circle decorative-circle-2"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const heroStyles = `
  /* Hero Section */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .hero-loading {
    text-align: center;
  }

  .loading-container {
    text-align: center;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  /* Hero Container */
  .hero-container {
    max-width: 1200px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    padding: 0 20px;
  }

  /* Hero Content (Left Side) */
  .hero-content {
    text-align: left;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.1;
    word-wrap: break-word;
  }

  .hero-subtitle {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }

  .hero-description {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    opacity: 0.8;
    line-height: 1.6;
  }

  .hero-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* Buttons */
  .hero-btn {
    display: inline-block;
    padding: 1rem 2rem;
    text-decoration: none;
    border-radius: 30px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    text-align: center;
    cursor: pointer;
    border: none;
  }

  .hero-btn-primary {
    background: white;
    color: #667eea;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .hero-btn-primary:hover {
    transform: scale(1.05);
  }

  .hero-btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .hero-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  /* Hero Image (Right Side) */
  .hero-image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-image-container {
    position: relative;
    width: 400px;
    height: 400px;
  }

  .profile-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 8px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    display: block;
  }

  .profile-image-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8rem;
    border: 8px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  /* Decorative Circles */
  .decorative-circle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .decorative-circle-1 {
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    animation: float 3s ease-in-out infinite;
  }

  .decorative-circle-2 {
    bottom: -10px;
    left: -30px;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.05);
    animation: float 2s ease-in-out infinite reverse;
  }

  /* Animations */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  /* ============================================
     RESPONSIVE DESIGN - OPTIMIZED FOR MOBILE
     ============================================ */

  /* Tablet (768px and below) */
  @media screen and (max-width: 768px) {
    .hero {
      padding: 2rem 1rem;
      min-height: 100vh;
    }

    .hero-container {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }

    .hero-content {
      order: 2;
    }

    .hero-image-wrapper {
      order: 1;
    }

    .hero-title {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .hero-description {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }

    .hero-buttons {
      justify-content: center;
      gap: 0.75rem;
    }

    .hero-btn {
      padding: 0.9rem 1.8rem;
      font-size: 1rem;
    }

    .hero-image-container {
      width: 280px;
      height: 280px;
    }

    .profile-image-placeholder {
      font-size: 6rem;
    }
  }

  /* Mobile (480px and below) */
  @media screen and (max-width: 480px) {
    .hero {
      padding: 1.5rem 0.75rem;
      min-height: 100vh;
    }

    .hero-container {
      gap: 2rem;
    }

    .hero-title {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }

    .hero-description {
      font-size: 1rem;
      margin-bottom: 1.25rem;
      line-height: 1.5;
    }

    .hero-buttons {
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .hero-btn {
      width: 100%;
      max-width: 280px;
      padding: 0.85rem 1.5rem;
    }

    .hero-image-container {
      width: 220px;
      height: 220px;
    }

    .profile-image,
    .profile-image-placeholder {
      border-width: 6px;
    }

    .profile-image-placeholder {
      font-size: 4.5rem;
    }

    .decorative-circle-1,
    .decorative-circle-2 {
      display: none;
    }
  }

  /* Small Mobile (360px and below) */
  @media screen and (max-width: 360px) {
    .hero {
      padding: 1rem 0.5rem;
    }

    .hero-title {
      font-size: 1.75rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .hero-description {
      font-size: 0.95rem;
    }

    .hero-btn {
      font-size: 0.95rem;
      padding: 0.75rem 1.25rem;
      max-width: 250px;
    }

    .hero-image-container {
      width: 200px;
      height: 200px;
    }

    .profile-image-placeholder {
      font-size: 4rem;
    }
  }
`;

export default Hero;