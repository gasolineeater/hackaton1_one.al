import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { User, RefreshToken } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { validations, validate } from '../middleware/validationMiddleware.js';
import logger from '../utils/logger.js';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               role:
 *                 type: string
 *                 enum: [user, admin, manager]
 *                 default: user
 *                 example: user
 *               customerId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *                         expiresIn:
 *                           type: string
 *                           example: 15m
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Server error
 */
router.post('/register', validations.register, validate, async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, role, customerId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return next(new AppError('Username or email already exists', 400));
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password, // Will be hashed by the model hook
      firstName,
      lastName,
      role: role || 'user',
      customerId
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = uuidv4();
    const refreshTokenExpiry = calculateExpiryDate(JWT_REFRESH_EXPIRATION);

    // Save refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiryDate: refreshTokenExpiry,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Return user info and tokens
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          customerId: user.customerId
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: JWT_ACCESS_EXPIRATION
        }
      }
    });
  } catch (error) {
    logger.error('Registration error:', { error: error.message, stack: error.stack });
    return next(new AppError('Registration failed', 500));
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *                         expiresIn:
 *                           type: string
 *                           example: 15m
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: error
 *               message: Invalid credentials
 *       403:
 *         description: Account is inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: error
 *               message: Account is inactive
 *       500:
 *         description: Server error
 */
router.post('/login', validations.login, validate, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: username ? { username } : { email }
    });

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Account is inactive', 403));
    }

    // Verify password
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = uuidv4();
    const refreshTokenExpiry = calculateExpiryDate(JWT_REFRESH_EXPIRATION);

    // Save refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiryDate: refreshTokenExpiry,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return user info and tokens
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          customerId: user.customerId
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: JWT_ACCESS_EXPIRATION
        }
      }
    });
  } catch (error) {
    logger.error('Login error:', { error: error.message, stack: error.stack });
    return next(new AppError('Login failed', 500));
  }
});

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token
 */
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 400));
    }

    // Find refresh token
    const tokenDoc = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        expiryDate: { [Op.gt]: new Date() },
        isRevoked: false
      },
      include: [User]
    });

    if (!tokenDoc) {
      return next(new AppError('Invalid or expired refresh token', 401));
    }

    const user = tokenDoc.User;

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Account is inactive', 403));
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const newRefreshToken = uuidv4();
    const refreshTokenExpiry = calculateExpiryDate(JWT_REFRESH_EXPIRATION);

    // Revoke old token
    tokenDoc.isRevoked = true;
    await tokenDoc.save();

    // Save new refresh token
    await RefreshToken.create({
      token: newRefreshToken,
      userId: user.id,
      expiryDate: refreshTokenExpiry,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Return new tokens
    res.json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn: JWT_ACCESS_EXPIRATION
        }
      }
    });
  } catch (error) {
    logger.error('Token refresh error:', { error: error.message, stack: error.stack });
    return next(new AppError('Token refresh failed', 500));
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 */
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Revoke specific refresh token
      await RefreshToken.update(
        { isRevoked: true },
        { where: { token: refreshToken } }
      );
    } else {
      // Revoke all user's refresh tokens
      await RefreshToken.update(
        { isRevoked: true },
        { where: { userId: req.user.id } }
      );
    }

    res.json({
      status: 'success',
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error('Logout error:', { error: error.message, stack: error.stack });
    return next(new AppError('Logout failed', 500));
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user info
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    logger.error('Get user error:', { error: error.message, stack: error.stack });
    return next(new AppError('Failed to get user info', 500));
  }
});

// Helper functions
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      customerId: user.customerId
    },
    JWT_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRATION }
  );
};

const calculateExpiryDate = (expiration) => {
  const expiryDate = new Date();
  const timeUnit = expiration.slice(-1);
  const timeValue = parseInt(expiration.slice(0, -1));

  switch (timeUnit) {
    case 's':
      expiryDate.setSeconds(expiryDate.getSeconds() + timeValue);
      break;
    case 'm':
      expiryDate.setMinutes(expiryDate.getMinutes() + timeValue);
      break;
    case 'h':
      expiryDate.setHours(expiryDate.getHours() + timeValue);
      break;
    case 'd':
      expiryDate.setDate(expiryDate.getDate() + timeValue);
      break;
    default:
      expiryDate.setDate(expiryDate.getDate() + 7); // Default to 7 days
  }

  return expiryDate;
};

export default router;
