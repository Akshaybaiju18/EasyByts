// models/Profile.js
// User profile model for portfolio information

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  title: {
    type: String,
    required: [true, 'Professional title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  tagline: {
    type: String,
    trim: true,
    maxlength: [200, 'Tagline cannot exceed 200 characters']
  },
  
  // About Section
  aboutMe: {
    type: String,
    required: [true, 'About me section is required'],
    maxlength: [2000, 'About me cannot exceed 2000 characters']
  },
  shortBio: {
    type: String,
    trim: true,
    maxlength: [300, 'Short bio cannot exceed 300 characters']
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  location: {
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  
  // Social Links
  socialLinks: {
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    website: { type: String, trim: true }
  },
  
  // Profile Image
  profileImage: {
    type: String,
    default: ''
  },
  
  // Resume
  resumeUrl: {
    type: String,
    trim: true
  },
  
  // Experience Summary
  yearsOfExperience: {
    type: Number,
    default: 0,
    min: [0, 'Experience cannot be negative']
  },
  
  // Skills Summary (top skills to highlight)
  topSkills: [{
    type: String,
    trim: true
  }],
  
  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  availabilityMessage: {
    type: String,
    trim: true,
    maxlength: [200, 'Availability message cannot exceed 200 characters']
  },
  
  // SEO
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  
  // Settings
  isPublic: {
    type: Boolean,
    default: true
  },
  showContactInfo: {
    type: Boolean,
    default: true
  },
  
  // Single profile per system
  isActive: {
    type: Boolean,
    default: true,
    unique: true,
    partialFilterExpression: { isActive: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for full name
profileSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for formatted location
profileSchema.virtual('formattedLocation').get(function() {
  const parts = [];
  if (this.location.city) parts.push(this.location.city);
  if (this.location.state) parts.push(this.location.state);
  if (this.location.country) parts.push(this.location.country);
  return parts.join(', ');
});

// Pre-save middleware
profileSchema.pre('save', function(next) {
  // Ensure only one active profile
  if (this.isNew && this.isActive) {
    this.constructor.updateMany(
      { _id: { $ne: this._id }, isActive: true },
      { isActive: false }
    ).exec();
  }
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
