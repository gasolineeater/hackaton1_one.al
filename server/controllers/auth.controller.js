const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv');

dotenv.config();

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
      return res.status(400).json({ message: 'Email is already in use!' });
    }

    const existingUsername = await User.findByUsername(req.body.username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken!' });
    }

    // Create new user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      company_name: req.body.company_name
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });

    // Return user data (excluding password) and token
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      company_name: user.company_name,
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: 'User not found!' });
    }

    // Validate password
    const isPasswordValid = await User.validatePassword(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION
    });

    // Return user data (excluding password) and token
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      company_name: user.company_name,
      accessToken: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: 'User not found!' });
    }

    // Return user data (excluding password)
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      company_name: user.company_name,
      created_at: user.created_at,
      updated_at: user.updated_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
