// routes/profile.js
// Profile management routes with image upload

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Profile = require('../models/Profile');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/profile';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// GET /api/profile - Get active profile (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({ isActive: true, isPublic: true });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// GET /api/profile/admin - Get profile for admin editing (ADMIN ONLY)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let profile = await Profile.findOne({ isActive: true });
    
    // If no profile exists, create a default one
    if (!profile) {
      profile = await Profile.create({
        firstName: 'Your',
        lastName: 'Name',
        title: 'Full Stack Developer',
        tagline: 'Passionate about creating amazing web experiences',
        aboutMe: 'Write about yourself here...',
        email: 'your.email@example.com',
        isActive: true
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// PUT /api/profile - Update profile (ADMIN ONLY)
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let profile = await Profile.findOne({ isActive: true });
    
    if (!profile) {
      // Create new profile if none exists
      profile = new Profile({
        ...req.body,
        isActive: true
      });
    } else {
      // Update existing profile
      Object.assign(profile, req.body);
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// POST /api/profile/upload-image - Upload profile image (ADMIN ONLY)
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Create URL for uploaded image
    const imageUrl = `/uploads/profile/${req.file.filename}`;
    
    // Update profile with new image URL
    let profile = await Profile.findOne({ isActive: true });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Delete old image if exists
    if (profile.profileImage && profile.profileImage !== imageUrl) {
      const oldImagePath = path.join(__dirname, '..', profile.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    profile.profileImage = imageUrl;
    await profile.save();

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        imageUrl: imageUrl,
        profile: profile
      }
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error uploading image'
    });
  }
});

// POST /api/profile/upload-resume - Upload resume (ADMIN ONLY)
router.post('/upload-resume', authenticateToken, requireAdmin, 
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = 'uploads/resume';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        cb(null, 'resume-' + Date.now() + path.extname(file.originalname));
      }
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/')) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF and document files are allowed'), false);
      }
    }
  }).single('resume'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No resume file provided'
        });
      }

      const resumeUrl = `/uploads/resume/${req.file.filename}`;
      
      let profile = await Profile.findOne({ isActive: true });
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      // Delete old resume if exists
      if (profile.resumeUrl) {
        const oldResumePath = path.join(__dirname, '..', profile.resumeUrl);
        if (fs.existsSync(oldResumePath)) {
          fs.unlinkSync(oldResumePath);
        }
      }

      profile.resumeUrl = resumeUrl;
      await profile.save();

      res.json({
        success: true,
        message: 'Resume uploaded successfully',
        data: {
          resumeUrl: resumeUrl
        }
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: 'Server error uploading resume'
      });
    }
  }
);

module.exports = router;
