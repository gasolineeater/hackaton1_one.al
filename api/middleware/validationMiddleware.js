import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorMiddleware.js';

/**
 * Validate request middleware using express-validator
 * Checks for validation errors and returns a consistent error response
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg
    }));

    const error = new AppError('Validation failed', 400);
    error.errors = validationErrors;

    return next(error);
  }

  next();
};

/**
 * Legacy validation middleware for Joi schemas
 * @param {Object} schema - Joi schema
 * @param {string} property - Request property to validate (body, params, query)
 */
export const validateWithJoi = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (!error) {
      return next();
    }

    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    const appError = new AppError('Validation failed', 400);
    appError.errors = errors;

    next(appError);
  };
};

/**
 * Common validation rules
 */
export const validations = {
  // Auth validations
  login: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],

  register: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
  ],

  // Customer validations
  customerId: [
    param('customerId')
      .isInt({ min: 1 })
      .withMessage('Customer ID must be a positive integer')
  ],

  // Service validations
  serviceId: [
    param('serviceId')
      .isInt({ min: 1 })
      .withMessage('Service ID must be a positive integer')
  ],

  // Notification validations
  notificationId: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Notification ID must be a positive integer')
  ],

  createNotification: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 })
      .withMessage('Title must be less than 255 characters'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required'),
    body('type')
      .isIn(['info', 'warning', 'alert', 'success'])
      .withMessage('Type must be one of: info, warning, alert, success'),
    body('category')
      .isIn(['system', 'billing', 'usage', 'service', 'security'])
      .withMessage('Category must be one of: system, billing, usage, service, security'),
    body('priority')
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Priority must be one of: low, medium, high, critical')
  ],

  // Pagination validations
  pagination: [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a non-negative integer')
  ]
};

export default {
  validate,
  validateWithJoi,
  validations
};
