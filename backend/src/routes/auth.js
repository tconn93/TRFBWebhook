const express = require('express');
const router = express.Router();
const { createUser, verifyPassword } = require('../services/userManager');
const { generateToken, authenticateToken } = require('../middleware/auth');

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { email, password, name }
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Create user
    const user = await createUser({ email, password, name });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

/**
 * Login user
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Verify credentials
    const user = await verifyPassword(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * Get current user
 * GET /api/auth/me
 * Requires authentication
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * Logout (client-side only - just removes token)
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // This endpoint exists for consistency and future enhancements (e.g., token blacklisting)
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
