const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const profileRoutes = require('./routes/profile');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIXED: Configure CORS and helmet properly for static files
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// ✅ FIXED: Configure helmet to allow static files
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:5000", "http://localhost:3000"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:3000"]
    }
  }
}));

// ✅ CRITICAL: Move static file serving BEFORE rate limiting
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api', limiter);

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', require('./routes/contact'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Portfolio CMS API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    staticFiles: 'Enabled at /uploads'
  });
});

// ✅ Test endpoint for uploaded files
app.get('/test-uploads', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'uploads');
  
  try {
    const profileDir = path.join(uploadsPath, 'profile');
    const profileFiles = fs.existsSync(profileDir) ? fs.readdirSync(profileDir) : [];
    
    res.json({
      success: true,
      uploadsPath,
      profileFiles,
      sampleImageUrl: profileFiles.length > 0 
        ? `http://localhost:${PORT}/uploads/profile/${profileFiles[0]}`
        : 'No files uploaded yet'
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      uploadsPath
    });
  }
});

// Start Server
const startServer = async () => {
  await connectDB();
  
  // ✅ Create upload directories if they don't exist
  /*const fs = require('fs');
  const uploadsDir = path.join(__dirname, 'uploads');
  const profileDir = path.join(uploadsDir, 'profile');
  const resumeDir = path.join(uploadsDir, 'resume');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('📁 Created uploads directory');
  }
  if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir);
    console.log('📁 Created uploads/profile directory');
  }
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir);
    console.log('📁 Created uploads/resume directory');
  }*/
  
  app.listen(PORT, () => {
    console.log('🚀=================================🚀');
    console.log(`🎯 Portfolio CMS Backend Server`);
    console.log(`📡 Server running on port: ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📁 Static Files: http://localhost:${PORT}/uploads`);
    console.log(`🧪 Test Endpoint: http://localhost:${PORT}/test-uploads`);
    console.log('🚀=================================🚀');
  });
};

startServer();
