import Joi from 'joi';

// Login validation schema
export const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password: Joi.string().required().min(6).max(100)
}).xor('username', 'email'); // Require either username or email

// Registration validation schema
export const registerSchema = Joi.object({
  username: Joi.string().required().min(3).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(100),
  firstName: Joi.string().required().min(1).max(50),
  lastName: Joi.string().required().min(1).max(50),
  customerId: Joi.number().integer().positive(),
  position: Joi.string().max(100),
  department: Joi.string().max(100),
  phoneNumber: Joi.string().max(20),
  role: Joi.string().valid('admin', 'manager', 'user')
});

// Password reset request validation schema
export const resetRequestSchema = Joi.object({
  email: Joi.string().required().email()
});

// Password reset validation schema
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required().min(6).max(100),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
});

// Change password validation schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(6).max(100),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword'))
});

// Update profile validation schema
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(50),
  lastName: Joi.string().min(1).max(50),
  position: Joi.string().max(100),
  department: Joi.string().max(100),
  phoneNumber: Joi.string().max(20)
});

// Refresh token validation schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export default {
  loginSchema,
  registerSchema,
  resetRequestSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  refreshTokenSchema
};
