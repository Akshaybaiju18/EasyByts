// models/BlogPost.js
// Blog post model for articles and tutorials

const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Blog post excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog post content is required']
  },
  author: {
    name: {
      type: String,
      required: true,
      default: 'Your Name'
    },
    email: String,
    avatar: String
  },
  featuredImage: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Featured image must be a valid URL'
    }
  },
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    enum: [
      'Web Development',
      'React',
      'Node.js',
      'JavaScript',
      'CSS',
      'Database',
      'DevOps',
      'Mobile Development',
      'UI/UX Design',
      'Career',
      'Tutorial',
      'Opinion',
      'Review'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  readTime: {
    type: Number, // Reading time in minutes
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [String]
  },
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost'
  }],
  comments: [{
    author: String,
    email: String,
    content: String,
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Create slug from title before saving
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Calculate reading time based on content
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }

  next();
});

// Indexes for efficient querying
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ featured: -1, publishedAt: -1 });
blogPostSchema.index({ slug: 1 });

// Virtual for URL
blogPostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Virtual for formatted publish date
blogPostSchema.virtual('formattedDate').get(function() {
  return this.publishedAt ? this.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
});

// Ensure virtuals are included in JSON
blogPostSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
