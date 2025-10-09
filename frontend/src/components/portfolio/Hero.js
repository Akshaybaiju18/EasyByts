// src/components/portfolio/Hero.js
// Hero section component

import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm <span className="hero-name">Your Name</span>
          </h1>
          <h2 className="hero-subtitle">Full-Stack Developer</h2>
          <p className="hero-description">
            I build beautiful, responsive web applications using modern technologies 
            like React, Node.js, and MongoDB. Welcome to my portfolio!
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">View My Work</a>
            <a href="/contact" className="btn btn-secondary">Contact Me</a>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" 
            alt="Profile" 
            className="profile-image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
