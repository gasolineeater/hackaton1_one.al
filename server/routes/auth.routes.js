const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

// Register a new user
router.post('/register', validate(authValidation.register), authController.register);

// Login user
router.post('/login', validate(authValidation.login), authController.login);

// Refresh token
router.post('/refresh-token', validate(authValidation.refreshToken), authController.refreshToken);

// Logout user
router.post('/logout', validate(authValidation.logout), authController.logout);

// Get user profile (protected route)
router.get('/profile', verifyToken, authController.profile);

module.exports = router;
