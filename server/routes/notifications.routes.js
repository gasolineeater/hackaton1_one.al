const express = require('express');
const notificationsController = require('../controllers/notifications.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all notifications
router.get('/', notificationsController.getAllNotifications);

// Get unread notification count
router.get('/unread-count', notificationsController.getUnreadCount);

// Get notification by ID
router.get('/:id', notificationsController.getNotificationById);

// Create a new notification
router.post('/', notificationsController.createNotification);

// Mark notification as read
router.put('/:id/read', notificationsController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationsController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationsController.deleteNotification);

// Delete all notifications
router.delete('/', notificationsController.deleteAllNotifications);

// Generate sample notifications
router.post('/generate-sample', notificationsController.generateSampleNotifications);

module.exports = router;
