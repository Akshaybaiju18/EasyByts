// routes/contact.js
// Contact form submission routes

const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// POST /api/contact - Submit contact form (PUBLIC)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create new contact message
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    await contactMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.'
    });
  } catch (error) {
    console.error('Error saving contact message:', error);

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
      message: 'Server error. Please try again.'
    });
  }
});

// GET /api/contact/admin - Get all contact messages (ADMIN ONLY)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      isRead,
      priority,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = {};
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (priority) query.priority = priority;

    // Get messages with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const messages = await ContactMessage.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const total = await ContactMessage.countDocuments(query);
    const unreadCount = await ContactMessage.countDocuments({ isRead: false });

    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      },
      stats: {
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching messages'
    });
  }
});

// GET /api/contact/admin/:id - Get single contact message (ADMIN ONLY)
router.get('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching message'
    });
  }
});

// PUT /api/contact/admin/:id - Update contact message (ADMIN ONLY)
router.put('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isRead, isReplied, priority, adminNotes } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead, isReplied, priority, adminNotes },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating message'
    });
  }
});

// DELETE /api/contact/admin/:id - Delete contact message (ADMIN ONLY)
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting message'
    });
  }
});

module.exports = router;
