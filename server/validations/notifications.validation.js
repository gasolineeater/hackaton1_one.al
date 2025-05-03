/**
 * Notifications validation schemas
 */

const Joi = require('joi');

// Get all notifications validation schema
const getAllNotifications = {
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100),
    offset: Joi.number().integer().min(0),
    read: Joi.boolean(),
    type: Joi.string().valid('info', 'warning', 'alert', 'success')
  })
};

// Get notification by ID validation schema
const getNotificationById = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

// Create notification validation schema
const createNotification = {
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(255),
    message: Joi.string().required().min(2),
    type: Joi.string().valid('info', 'warning', 'alert', 'success').default('info'),
    user_id: Joi.number().integer()
  })
};

// Mark as read validation schema
const markAsRead = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

// Delete notification validation schema
const deleteNotification = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

// Delete all notifications validation schema
const deleteAllNotifications = {
  query: Joi.object().keys({
    read: Joi.boolean()
  })
};

// Generate sample notifications validation schema
const generateSampleNotifications = {
  query: Joi.object().keys({
    count: Joi.number().integer().min(1).max(20).default(5)
  })
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
  generateSampleNotifications
};
