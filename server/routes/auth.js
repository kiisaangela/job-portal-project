const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { register, login, getProfile, forgotPassword, resetPassword } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', auth, getProfile);

module.exports = router;
