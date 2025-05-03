import { verifyToken } from '../utils/jwtUtils.js';
import { UserRepository } from '../repositories/index.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    // Find user
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'User account is inactive'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      error: error.message
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {string|string[]} roles - Required role(s)
 */
export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Customer access middleware
 * Ensures user can only access their own customer's data
 */
export const customerAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }

  // Admin can access all customers
  if (req.user.role === 'admin') {
    return next();
  }

  const requestedCustomerId = parseInt(req.params.customerId || req.body.customerId);
  
  // If no customer ID is specified, continue
  if (!requestedCustomerId) {
    return next();
  }

  // Check if user belongs to the requested customer
  if (req.user.customerId !== requestedCustomerId) {
    return res.status(403).json({
      status: 'error',
      message: 'You can only access your own customer data'
    });
  }

  next();
};

export default {
  authenticate,
  authorize,
  customerAccess
};
