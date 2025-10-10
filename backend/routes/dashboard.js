// routes/dashboard.js
// Dashboard analytics and statistics routes

const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const BlogPost = require('../models/BlogPost');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get counts
    const projectsCount = await Project.countDocuments();
    const skillsCount = await Skill.countDocuments();
    const blogPostsCount = await BlogPost.countDocuments();

    // Get published content counts
    const publishedProjects = await Project.countDocuments({ status: 'published' });
    const publishedPosts = await BlogPost.countDocuments({ status: 'published' });
    const featuredProjects = await Project.countDocuments({ featured: true });
    const featuredPosts = await BlogPost.countDocuments({ featured: true });

    // Get recent activity
    const recentProjects = await Project.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title status updatedAt');

    const recentPosts = await BlogPost.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title status updatedAt views');

    // Get skill categories breakdown
    const skillsByCategory = await Skill.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get blog categories breakdown
    const postsByCategory = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get monthly blog post stats
    const monthlyPosts = await BlogPost.aggregate([
      {
        $match: {
          status: 'published',
          publishedAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$publishedAt' },
            month: { $month: '$publishedAt' }
          },
          count: { $sum: 1 },
          views: { $sum: '$views' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    // Calculate total blog views
    const totalViews = await BlogPost.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          projectsCount,
          skillsCount,
          blogPostsCount,
          publishedProjects,
          publishedPosts,
          featuredProjects,
          featuredPosts,
          totalViews: totalViews[0]?.totalViews || 0
        },
        recentActivity: {
          projects: recentProjects,
          posts: recentPosts
        },
        breakdown: {
          skillsByCategory,
          postsByCategory,
          monthlyPosts: monthlyPosts.slice(0, 12) // Last 12 months
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard statistics'
    });
  }
});

// GET /api/dashboard/content-summary - Get content summary for quick actions
router.get('/content-summary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get draft content needing attention
    const draftProjects = await Project.find({ status: 'draft' })
      .select('title createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    const draftPosts = await BlogPost.find({ status: 'draft' })
      .select('title createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get most viewed blog posts
    const popularPosts = await BlogPost.find({ status: 'published' })
      .select('title slug views publishedAt')
      .sort({ views: -1 })
      .limit(10);

    // Get newest skills
    const newestSkills = await Skill.find({ status: 'active' })
      .select('name category level createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        draftProjects,
        draftPosts,
        popularPosts,
        newestSkills
      }
    });
  } catch (error) {
    console.error('Content summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching content summary'
    });
  }
});

module.exports = router;