const Notification = require('../models/notification.model');

/**
 * Get all notifications for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with notifications
 */
exports.getAllNotifications = async (req, res) => {
  try {
    const { limit, offset, read, type } = req.query;
    
    const options = { 
      limit, 
      offset,
      read: read !== undefined ? read === 'true' : undefined,
      type
    };
    
    // Get notifications
    const notifications = await Notification.findAllByUser(req.userId, options);
    
    // Get unread count
    const unreadCount = await Notification.getUnreadCount(req.userId);
    
    res.status(200).json({
      notifications,
      unreadCount,
      total: notifications.length,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get notification by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with notification
 */
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found!' });
    }
    
    // Check if the notification belongs to the user
    if (notification.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new notification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with created notification
 */
exports.createNotification = async (req, res) => {
  try {
    // Only allow admins to create notifications for other users
    const targetUserId = req.body.user_id || req.userId;
    
    if (targetUserId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied! Only admins can create notifications for other users.' });
    }
    
    // Create notification
    const notification = await Notification.create({
      title: req.body.title,
      message: req.body.message,
      type: req.body.type,
      user_id: targetUserId
    });
    
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark notification as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated notification
 */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found!' });
    }
    
    // Check if the notification belongs to the user
    if (notification.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Mark as read
    const updatedNotification = await Notification.markAsRead(req.params.id);
    
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark all notifications as read for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
exports.markAllAsRead = async (req, res) => {
  try {
    // Mark all as read
    const updatedCount = await Notification.markAllAsRead(req.userId);
    
    res.status(200).json({
      message: `Marked ${updatedCount} notifications as read.`,
      updatedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete notification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found!' });
    }
    
    // Check if the notification belongs to the user
    if (notification.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Delete notification
    const result = await Notification.delete(req.params.id);
    
    if (result) {
      res.status(200).json({ message: 'Notification deleted successfully!' });
    } else {
      res.status(500).json({ message: 'Failed to delete notification!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete all notifications for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
exports.deleteAllNotifications = async (req, res) => {
  try {
    const { read } = req.query;
    
    const options = {
      read: read !== undefined ? read === 'true' : undefined
    };
    
    // Delete all notifications
    const deletedCount = await Notification.deleteAllByUser(req.userId, options);
    
    res.status(200).json({
      message: `Deleted ${deletedCount} notifications.`,
      deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get unread notification count for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with unread count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    // Get unread count
    const unreadCount = await Notification.getUnreadCount(req.userId);
    
    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Generate sample notifications for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with generated notifications
 */
exports.generateSampleNotifications = async (req, res) => {
  try {
    const count = req.query.count ? parseInt(req.query.count) : 5;
    
    // Generate sample notifications
    const notifications = await Notification.generateSampleNotifications(req.userId, count);
    
    res.status(200).json({
      message: `Generated ${notifications.length} sample notifications.`,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
