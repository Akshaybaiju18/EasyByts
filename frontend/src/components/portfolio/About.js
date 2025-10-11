import React from 'react';

const About = ({ profile }) => {
  return (
    <>
      <style>{aboutStyles}</style>
      <section className="about">
        <div className="container">
          <h2 className="about-title">About Me</h2>
          <div className="about-content">
            <p className="about-text">{profile?.aboutMe || 'Loading about information...'}</p>
            {profile?.topSkills && profile.topSkills.length > 0 && (
              <div className="top-skills">
                <h3 className="skills-title">Specializing in:</h3>
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
    </>
  );
};

const aboutStyles = `
  /* About Section */
  .about {
    padding: 4rem 0;
    background: #f8f9fa;
    width: 100%;
    overflow-x: hidden;
  }

  .about .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .about-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #333;
    font-weight: 700;
  }

  .about-content {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .about-text {
    font-size: 1.15rem;
    line-height: 1.8;
    color: #555;
    margin-bottom: 2rem;
    text-align: justify;
    word-wrap: break-word;
  }

  .top-skills {
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 2px solid #e9ecef;
  }

  .skills-title {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1.25rem;
    font-weight: 600;
  }

  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .skill-tag {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.6rem 1.25rem;
    border-radius: 25px;
    font-size: 0.95rem;
    font-weight: 500;
    box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
    display: inline-block;
  }

  .skill-tag:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  /* ============================================
     RESPONSIVE DESIGN
     ============================================ */

  /* Tablet (768px and below) */
  @media screen and (max-width: 768px) {
    .about {
      padding: 3rem 0;
    }

    .about .container {
      padding: 0 15px;
    }

    .about-title {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    .about-content {
      padding: 2rem;
    }

    .about-text {
      font-size: 1.05rem;
      line-height: 1.7;
      text-align: left;
    }

    .skills-title {
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    .skill-tag {
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
    }
  }

  /* Mobile Large (600px and below) */
  @media screen and (max-width: 600px) {
    .about {
      padding: 2.5rem 0;
    }

    .about .container {
      padding: 0 12px;
    }

    .about-title {
      font-size: 1.75rem;
      margin-bottom: 1.25rem;
    }

    .about-content {
      padding: 1.5rem;
      border-radius: 10px;
    }

    .about-text {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .top-skills {
      margin-top: 2rem;
      padding-top: 1.5rem;
    }

    .skills-title {
      font-size: 1.2rem;
      margin-bottom: 0.85rem;
    }

    .skills-list {
      gap: 0.6rem;
    }

    .skill-tag {
      font-size: 0.85rem;
      padding: 0.45rem 0.9rem;
    }
  }

  /* Mobile Small (480px and below) */
  @media screen and (max-width: 480px) {
    .about {
      padding: 2rem 0;
    }

    .about .container {
      padding: 0 10px;
    }

    .about-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .about-content {
      padding: 1.25rem;
      border-radius: 8px;
    }

    .about-text {
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.25rem;
    }

    .top-skills {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
    }

    .skills-title {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }

    .skills-list {
      gap: 0.5rem;
    }

    .skill-tag {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }
  }

  /* Mobile Extra Small (360px and below) */
  @media screen and (max-width: 360px) {
    .about-title {
      font-size: 1.35rem;
    }

    .about-content {
      padding: 1rem;
    }

    .about-text {
      font-size: 0.9rem;
    }

    .skills-title {
      font-size: 1rem;
    }

    .skill-tag {
      font-size: 0.75rem;
      padding: 0.35rem 0.7rem;
    }
  }
`;

export default About;