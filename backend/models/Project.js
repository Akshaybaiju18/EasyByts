const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Project title is required'],
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  fullDescription: {
    type: String
  },
  technologies: [{
    type: String,
    trim: true
  }],
  projectUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Project URL must be a valid URL'
    }
  },
  githubUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'GitHub URL must be a valid URL'
    }
  },
  demoUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Demo URL must be a valid URL'
    }
  },
  featuredImage: String,
  projectImages: [String],
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  featured: {
    type: Boolean,
    default: false
  },
  startDate: Date,
  endDate: Date,
  sortOrder: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create slug from title before saving
projectSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
