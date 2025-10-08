const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET /api/projects - Get all published projects
router.get('/', async (req, res) => {
  try {
    const { status = 'published', featured } = req.query;
    
    // Build query
    let query = { status };
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    const projects = await Project.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching projects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/projects/:slug - Get single project by slug
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ 
      slug: req.params.slug,
      status: 'published'
    }).select('-__v');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching project'
    });
  }
});

// POST /api/projects - Create new project (for CMS)
router.post('/', async (req, res) => {
  try {
    const slugify = require('slugify');

    // Auto-generate slug from title
    const slug = slugify(req.body.title || '', { lower: true, strict: true });

    const projectData = {
      ...req.body,
      slug,
    };

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error creating project:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Project with this slug already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating project',
    });
  }
});


// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating project'
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting project'
    });
  }
});

module.exports = router;
