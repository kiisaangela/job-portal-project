const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const pool = require('./config/db');

// Environment variables with fallbacks

const JWT_SECRET = process.env.JWT_SECRET || 'nexus-job-portal-secret-key';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Set JWT secret for auth middleware
process.env.JWT_SECRET = JWT_SECRET;

const app = express();

// Add debug information to identify CORS issues
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins temporarily for debugging
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('Body:', req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : '(no body)');
  console.log('Params:', JSON.stringify(req.params));
  next();
});

// Disable all request logging
// app.use((req, res, next) => { next(); });

// Test database connection and create tables if they don't exist
const initializeDatabase = async () => {
  try {
    // Test connection first
    const connection = await pool.getConnection();
    connection.release();
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('job_seeker', 'employer') NOT NULL DEFAULT 'job_seeker',
        reset_token VARCHAR(255) DEFAULT NULL,
        reset_token_expiry DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create jobs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employer_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type ENUM('full-time', 'part-time', 'contract', 'remote') NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        salary DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create applications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        applicant_id INT NOT NULL,
        cover_letter TEXT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database connected successfully');

  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

// Initialize database tables
initializeDatabase();

// Mount routes (without logging)
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Debug route for password reset
app.post('/api/debug/forgot-password', (req, res) => {
  console.log('Debug forgot password route hit with body:', req.body);
  res.status(200).json({ message: 'Debug forgot password route working' });
});

// Direct forgot password route to bypass any route issues
app.post('/api/direct/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('Direct forgot password route hit with email:', email);
  
  try {
    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Generate reset token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    );

    // In production, you would send an email with the reset link
    res.status(200).json({
      message: 'Password reset token generated',
      resetToken,
      resetLink: `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`
    });
  } catch (err) {
    console.error('Error in direct forgot password route:', err);
    res.status(500).json({ error: 'Error processing request' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  res.status(500).json({ error: 'Server error' });
});

// Start server
const SERVER_PORT = 5000;
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});