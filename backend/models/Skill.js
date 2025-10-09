// models/Skill.js
// Skills model for technical and soft skills

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: [
      'Frontend', 
      'Backend', 
      'Database', 
      'DevOps', 
      'Mobile', 
      'Design', 
      'Tools',
      'Soft Skills',
      'Languages'
    ]
  },
  level: {
    type: String,
    required: [true, 'Skill level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  proficiency: {
    type: Number,
    required: true,
    min: [1, 'Proficiency must be between 1-100'],
    max: [100, 'Proficiency must be between 1-100'],
    default: 50
  },
  icon: {
    type: String, // For storing icon class names or URLs
    default: ''
  },
  color: {
    type: String, // For skill badge colors
    default: '#007bff'
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  yearsOfExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    default: 0
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    credentialId: String,
    url: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'learning', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for efficient querying
skillSchema.index({ category: 1, level: -1 });
skillSchema.index({ featured: -1, sortOrder: 1 });

// Virtual for experience level text
skillSchema.virtual('experienceLevel').get(function() {
  if (this.yearsOfExperience < 1) return 'New to';
  if (this.yearsOfExperience < 2) return '1+ year';
  if (this.yearsOfExperience < 5) return `${this.yearsOfExperience}+ years`;
  return `${this.yearsOfExperience}+ years`;
});

// Ensure virtuals are included in JSON
skillSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Skill', skillSchema);