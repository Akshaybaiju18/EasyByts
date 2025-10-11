// src/components/portfolio/Hero.js
// Hero section component

import React from 'react';

const Hero = ({ profile }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        {profile?.profileImage && (
          <img 
            src={`http://localhost:5000${profile.profileImage}`} 
            alt={profile.fullName}
            className="profile-image"
          />
        )}
        <h1>{profile?.fullName || 'Your Name'}</h1>
        <h2>{profile?.title || 'Your Title'}</h2>
        <p>{profile?.tagline || 'Your tagline here'}</p>
        {profile?.yearsOfExperience > 0 && (
          <span>{profile.yearsOfExperience}+ years experience</span>
        )}
      </div>
    </section>
  );
};

export default Hero;
