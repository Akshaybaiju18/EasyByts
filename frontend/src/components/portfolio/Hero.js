// src/components/portfolio/Hero.js
import React from 'react';
import { Link } from 'react-router-dom';


const Hero = ({ profile }) => {
  if (!profile) {
    return (
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading...</p>
        </div>
      </section>
    );
  }


  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center'
      }}>
        {/* Left Content */}
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            opacity: 0.9
          }}>
          </div>
          
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            lineHeight: '1.1'
          }}>
            {profile.firstName} {profile.lastName}
          </h1>
          
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '400',
            marginBottom: '1.5rem',
            opacity: 0.9
          }}>
            {profile.title}
          </h2>
          
          {profile.tagline && (
            <p style={{
              fontSize: '1.3rem',
              marginBottom: '2rem',
              opacity: 0.8,
              lineHeight: '1.6'
            }}>
              {profile.tagline}
            </p>
          )}
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <Link
              to="/contact"
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
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Get In Touch
            </Link>
            
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '30px',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                📄 Download Resume
              </a>
            )}
          </div>
        </div>


        {/* Right Content - Profile Image */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '400px',
            height: '400px'
          }}>
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={`${profile.firstName} ${profile.lastName}`}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '8px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8rem',
                border: '8px solid rgba(255,255,255,0.2)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}>
                👤
              </div>
            )}
            
            {/* Decorative elements */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              animation: 'float 3s ease-in-out infinite'
            }}></div>
            
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '-30px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              animation: 'float 2s ease-in-out infinite reverse'
            }}></div>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 2rem !important;
          }
          .hero-image {
            width: 300px !important;
            height: 300px !important;
          }
          .hero-title {
            font-size: 2.5rem !important;
          }
          .hero-subtitle {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};


export default Hero;
