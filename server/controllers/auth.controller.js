const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/config');
const logger = require('../utils/logger');
const { success, error, unauthorized, notFound, badRequest } = require('../utils/apiResponse');

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id },
    config.auth.jwtSecret,
    { expiresIn: config.auth.jwtExpiration }
  );
};

/**
 * Generate refresh token
 * @param {Object} user - User object
 * @returns {string} - Refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, type: 'refresh' },
    config.auth.jwtSecret,
    { expiresIn: '7d' } // Refresh token valid for 7 days
  );
};

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with token and user data
 */
exports.register = async (req, res) => {
  try {
    // Check if username or email already exists
    const existingUser = await User.findByEmail(req.body.email);
    if (existingUser) {
      return badRequest(res, 'Email is already in use!');
    }

    const existingUsername = await User.findByUsername(req.body.username);
    if (existingUsername) {
      return badRequest(res, 'Username is already taken!');
    }

    // Create new user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      company_name: req.body.company_name
    });

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    await User.saveRefreshToken(user.id, refreshToken);

    // Return user data and tokens
    return success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      company_name: user.company_name,
      accessToken,
      refreshToken
    }, 'User registered successfully', 201);
  } catch (err) {
    logger.error('Error in register:', err);
    return error(res, err.message);
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with token and user data
 */
exports.login = async (req, res) => {
  try {
    // Find user by email
    const user = await User.findByEmail(req.body.email);
    if (!user) {
      return notFound(res, 'User not found!');
    }

    // Validate password
    const isPasswordValid = await User.validatePassword(req.body.password, user.password);
    if (!isPasswordValid) {
      return unauthorized(res, 'Invalid password!');
    }

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    await User.saveRefreshToken(user.id, refreshToken);

    // Return user data and tokens
    return success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      company_name: user.company_name,
      accessToken,
      refreshToken
    }, 'Login successful');
  } catch (err) {
    logger.error('Error in login:', err);
    return error(res, err.message);
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with user data
 */
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return notFound(res, 'User not found!');
    }

    // Return user data (excluding password)
    return success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      company_name: user.company_name,
      created_at: user.created_at,
      updated_at: user.updated_at
    }, 'User profile retrieved successfully');
  } catch (err) {
    logger.error('Error in profile:', err);
    return error(res, err.message);
  }
};

/**
 * Refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with new tokens
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return badRequest(res, 'Refresh token is required');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.auth.jwtSecret);
    } catch (err) {
      return unauthorized(res, 'Invalid refresh token');
    }

    // Check if token is a refresh token
    if (!decoded.type || decoded.type !== 'refresh') {
      return unauthorized(res, 'Invalid token type');
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return notFound(res, 'User not found');
    }

    // Check if refresh token is valid
    const isValidToken = await User.verifyRefreshToken(user.id, refreshToken);
    if (!isValidToken) {
      return unauthorized(res, 'Invalid refresh token');
    }

    // Generate new tokens
    const accessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new refresh token and invalidate old one
    await User.updateRefreshToken(user.id, refreshToken, newRefreshToken);

    // Return new tokens
    return success(res, {
      accessToken,
      refreshToken: newRefreshToken
    }, 'Token refreshed successfully');
  } catch (err) {
    logger.error('Error in refreshToken:', err);
    return error(res, err.message);
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return badRequest(res, 'Refresh token is required');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.auth.jwtSecret);
    } catch (err) {
      // If token is invalid, just return success
      return success(res, null, 'Logged out successfully');
    }

    // Invalidate refresh token
    await User.invalidateRefreshToken(decoded.id, refreshToken);

    return success(res, null, 'Logged out successfully');
  } catch (err) {
    logger.error('Error in logout:', err);
    return error(res, err.message);
  }
};
