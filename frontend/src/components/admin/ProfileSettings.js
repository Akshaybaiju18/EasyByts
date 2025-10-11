// src/components/admin/ProfileSettings.js


import React, { useState, useEffect } from 'react';
import API from '../../services/api-service';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    title: '',
    tagline: '',
    aboutMe: '',
    shortBio: '',
    email: '',
    phone: '',
    location: {
      city: '',
      state: '',
      country: ''
    },
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      website: ''
    },
    profileImage: '',
    resumeUrl: '',
    yearsOfExperience: 0,
    topSkills: [],
    isAvailable: true,
    availabilityMessage: '',
    metaDescription: '',
    showContactInfo: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/profile/admin');
      const profileData = response.data.data;
      
      // ✅ FIXED: Ensure all nested objects exist with proper defaults
      setProfile({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        title: profileData.title || '',
        tagline: profileData.tagline || '',
        aboutMe: profileData.aboutMe || '',
        shortBio: profileData.shortBio || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        location: {
          city: profileData.location?.city || '',
          state: profileData.location?.state || '',
          country: profileData.location?.country || ''
        },
        socialLinks: {
          github: profileData.socialLinks?.github || '',
          linkedin: profileData.socialLinks?.linkedin || '',
          twitter: profileData.socialLinks?.twitter || '',
          instagram: profileData.socialLinks?.instagram || '',
          website: profileData.socialLinks?.website || ''
        },
        profileImage: profileData.profileImage || '',
        resumeUrl: profileData.resumeUrl || '',
        yearsOfExperience: profileData.yearsOfExperience || 0,
        topSkills: profileData.topSkills || [],
        isAvailable: profileData.isAvailable !== undefined ? profileData.isAvailable : true,
        availabilityMessage: profileData.availabilityMessage || '',
        metaDescription: profileData.metaDescription || '',
        showContactInfo: profileData.showContactInfo !== undefined ? profileData.showContactInfo : true
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Keep default values if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
                 type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleTopSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfile(prev => ({ ...prev, topSkills: skills }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await API.post('/profile/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfile(prev => ({ ...prev, profileImage: response.data.data.imageUrl }));
      alert('Profile image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await API.post('/profile/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProfile(prev => ({ ...prev, resumeUrl: response.data.data.resumeUrl }));
      alert('Resume uploaded successfully!');
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await API.put('/profile', profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Profile Settings</h2>
        <p style={{ color: '#6c757d', margin: 0 }}>
          Manage your portfolio information and personal details
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom: '2px solid #e9ecef',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { key: 'personal', label: '👤 Personal Info' },
            { key: 'contact', label: '📞 Contact & Social' },
            { key: 'about', label: '📝 About & Bio' },
            { key: 'settings', label: '⚙️ Settings' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '1rem 0',
                fontSize: '1rem',
                fontWeight: '500',
                color: activeTab === tab.key ? '#007bff' : '#6c757d',
                borderBottom: activeTab === tab.key ? '2px solid #007bff' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {/* Profile Image */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div>
                {profile.profileImage ? (
                  <img
                    src={`http://localhost:5000${profile.profileImage}`}
                    alt="Profile"
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid #007bff'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: '#6c757d'
                  }}>
                    👤
                  </div>
                )}
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Profile Picture</h4>
                <p style={{ color: '#6c757d', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                  Upload a professional photo (JPG, PNG, max 5MB)
                </p>
                <label style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: uploading ? '#6c757d' : '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem'
                }}>
                  {uploading ? 'Uploading...' : 'Choose Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Professional Title *
              </label>
              <input
                type="text"
                name="title"
                value={profile.title}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="e.g., Full Stack Developer, UI/UX Designer"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={profile.tagline}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="A catchy one-liner about yourself"
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={profile.yearsOfExperience}
                  onChange={handleChange}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Top Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(profile.topSkills) ? profile.topSkills.join(', ') : ''}
                  onChange={handleTopSkillsChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="React, Node.js, Python"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {/* Contact Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Location</h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    City
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={profile.location.city}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    State
                  </label>
                  <input
                    type="text"
                    name="location.state"
                    value={profile.location.state}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    name="location.country"
                    value={profile.location.country}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Social Links</h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    GitHub
                  </label>
                  <input
                    type="url"
                    name="socialLinks.github"
                    value={profile.socialLinks.github}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="socialLinks.linkedin"
                    value={profile.socialLinks.linkedin}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="socialLinks.twitter"
                    value={profile.socialLinks.twitter}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Website
                  </label>
                  <input
                    type="url"
                    name="socialLinks.website"
                    value={profile.socialLinks.website}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                About Me *
              </label>
              <textarea
                name="aboutMe"
                value={profile.aboutMe}
                onChange={handleChange}
                required
                rows={8}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                placeholder="Tell visitors about yourself, your background, interests, and what drives you..."
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Short Bio
              </label>
              <textarea
                name="shortBio"
                value={profile.shortBio}
                onChange={handleChange}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                placeholder="A brief description for cards and previews (max 300 characters)"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Meta Description (SEO)
              </label>
              <textarea
                name="metaDescription"
                value={profile.metaDescription}
                onChange={handleChange}
                rows={2}
                maxLength={160}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                placeholder="Brief description for search engines (max 160 characters)"
              />
              <small style={{ color: '#6c757d' }}>
                {profile.metaDescription.length}/160 characters
              </small>
            </div>

            {/* Resume Upload */}
            <div style={{
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Resume/CV</h4>
              {profile.resumeUrl && (
                <div style={{ marginBottom: '1rem' }}>
                  <a
                    href={`http://localhost:5000${profile.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    📄 View Current Resume
                  </a>
                </div>
              )}
              <label style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: uploadingResume ? '#6c757d' : '#28a745',
                color: 'white',
                borderRadius: '4px',
                cursor: uploadingResume ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem'
              }}>
                {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  style={{ display: 'none' }}
                />
              </label>
              <p style={{ fontSize: '0.8rem', color: '#6c757d', margin: '0.5rem 0 0 0' }}>
                Supported formats: PDF, DOC, DOCX (max 10MB)
              </p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>Availability Status</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={profile.isAvailable}
                    onChange={handleChange}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontWeight: '500' }}>Available for work</span>
                </label>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Availability Message
                </label>
                <input
                  type="text"
                  name="availabilityMessage"
                  value={profile.availabilityMessage}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., Available for freelance projects"
                />
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '1rem' }}>Privacy Settings</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="showContactInfo"
                    checked={profile.showContactInfo}
                    onChange={handleChange}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontWeight: '500' }}>Show contact information publicly</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '1rem 3rem',
              background: saving ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 6px 20px rgba(102, 126, 234, 0.3)'
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
