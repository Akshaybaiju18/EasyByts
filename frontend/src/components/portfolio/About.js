import React from 'react';

const About = ({ profile }) => {
  return (
    <section className="about">
      <div className="container">
        <h2>About Me</h2>
        <div className="about-content">
          <p>{profile?.aboutMe || 'Loading about information...'}</p>
          {profile?.topSkills && profile.topSkills.length > 0 && (
            <div className="top-skills">
              <h3>Specializing in:</h3>
              <div className="skills-list">
                {profile.topSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
