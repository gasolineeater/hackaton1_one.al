const express = require('express');
const notificationsController = require('../controllers/notifications.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const notificationsValidation = require('../validations/notifications.validation');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all notifications
router.get('/', validate(notificationsValidation.getAllNotifications), notificationsController.getAllNotifications);

// Get unread notification count
router.get('/unread-count', notificationsController.getUnreadCount);

// Get notification by ID
router.get('/:id', validate(notificationsValidation.getNotificationById), notificationsController.getNotificationById);

// Create a new notification
router.post('/', validate(notificationsValidation.createNotification), notificationsController.createNotification);

// Mark notification as read
router.put('/:id/read', validate(notificationsValidation.markAsRead), notificationsController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationsController.markAllAsRead);

// Delete notification
router.delete('/:id', validate(notificationsValidation.deleteNotification), notificationsController.deleteNotification);

// Delete all notifications
router.delete('/', validate(notificationsValidation.deleteAllNotifications), notificationsController.deleteAllNotifications);

// Generate sample notifications
router.post('/generate-sample', validate(notificationsValidation.generateSampleNotifications), notificationsController.generateSampleNotifications);

module.exports = router;
