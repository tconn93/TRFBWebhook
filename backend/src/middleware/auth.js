const jwt = require('jsonwebtoken');
const { getUserById } = require('../services/userManager');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token for a user
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
function authenticateToken(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }

  // Get user from database
  const user = getUserById(decoded.id);

  if (!user) {
    return res.status(403).json({
      success: false,
      error: 'User not found'
    });
  }

  // Attach user to request (without password)
  const { password, ...userWithoutPassword } = user;
  req.user = userWithoutPassword;

  next();
}

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't require it
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = getUserById(decoded.id);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      }
    }
  }

  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  optionalAuth
};
