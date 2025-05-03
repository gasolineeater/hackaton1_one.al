/**
 * Authentication validation schemas
 */

const Joi = require('joi');

// Register validation schema
const register = {
  body: Joi.object().keys({
    username: Joi.string().required().min(3).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(30)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'))
      .message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    role: Joi.string().valid('user', 'admin'),
    company_name: Joi.string().required().min(2).max(100)
  })
};

// Login validation schema
const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
};

module.exports = {
  register,
  login
};
