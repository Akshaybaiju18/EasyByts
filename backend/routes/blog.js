// routes/blog.js
// API routes for managing blog posts

const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// GET /api/blog - Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { 
      status = 'published',
      category,
      tag,
      featured,
      limit = 10,
      page = 1,
      sort = '-publishedAt'
    } = req.query;

    // Build query
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (featured !== undefined) query.featured = featured === 'true';

    // Only include published posts for public API
    if (status === 'published') {
      query.publishedAt = { $lte: new Date() };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await BlogPost.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select('title slug excerpt author featuredImage category tags publishedAt readTime views likes featured')
      .populate('relatedPosts', 'title slug excerpt featuredImage');

    const total = await BlogPost.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      count: posts.length,
      total,
      totalPages,
      currentPage: parseInt(page),
      data: posts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching blog posts'
    });
  }
});

// GET /api/blog/categories - Get all blog categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category', { status: 'published' });
    const categoryStats = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories,
      stats: categoryStats
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
});

// GET /api/blog/tags - Get all blog tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: tags.map(tag => ({ name: tag._id, count: tag.count }))
    });
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tags'
    });
  }
});

// GET /api/blog/:slug - Get single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published'
    })
    .populate('relatedPosts', 'title slug excerpt featuredImage publishedAt readTime')
    .select('-__v');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching blog post'
    });
  }
});

// POST /api/blog - Create new blog post
router.post('/', async (req, res) => {
  try {
    const post = new BlogPost(req.body);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Error creating blog post:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Blog post with this slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating blog post'
    });
  }
});

// PUT /api/blog/:id - Update blog post
router.put('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating blog post'
    });
  }
});

// DELETE /api/blog/:id - Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting blog post'
    });
  }
});

module.exports = router;