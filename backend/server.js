const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const profileRoutes = require('./routes/profile');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- ENVIRONMENT ---------- //
const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://portfolio-frontend1-3g2f.onrender.com'
  : 'http://localhost:3000';

// ---------- MIDDLEWARE ---------- //
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Helmet with dynamic configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", FRONTEND_URL],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", FRONTEND_URL]
    }
  }
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// ---------- ROUTES ---------- //
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Portfolio CMS API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Portfolio CMS Backend is running. Use /api routes.');
});

// ---------- DATABASE ---------- //
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// ---------- START SERVER ---------- //
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log('🚀=================================🚀');
    console.log(`🎯 Portfolio CMS Backend Server`);
    console.log(`📡 Server running on port: ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log('🚀=================================🚀');
  });
};

startServer();
