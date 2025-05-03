const { pool } = require('../config/db.config');

/**
 * Notification Model
 * Provides methods for managing user notifications
 */
class Notification {
  constructor(notification) {
    this.id = notification.id;
    this.title = notification.title;
    this.message = notification.message;
    this.type = notification.type || 'info';
    this.is_read = notification.is_read || false;
    this.user_id = notification.user_id;
    this.created_at = notification.created_at;
  }

  /**
   * Create a new notification
   * @param {Object} newNotification - Notification object
   * @returns {Promise} - Created notification
   */
  static async create(newNotification) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO notifications (title, message, type, is_read, user_id) VALUES (?, ?, ?, ?, ?)',
        [
          newNotification.title,
          newNotification.message,
          newNotification.type || 'info',
          newNotification.is_read || false,
          newNotification.user_id
        ]
      );

      const [notification] = await pool.execute('SELECT * FROM notifications WHERE id = ?', [result.insertId]);
      return notification[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find notification by ID
   * @param {number} id - Notification ID
   * @returns {Promise} - Notification object
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM notifications WHERE id = ?', [id]);
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all notifications for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (limit, offset, read, type)
   * @returns {Promise} - Array of notifications
   */
  static async findAllByUser(userId, options = {}) {
    try {
      let query = 'SELECT * FROM notifications WHERE user_id = ?';
      const queryParams = [userId];
      
      // Add read filter if provided
      if (options.read !== undefined) {
        query += ' AND is_read = ?';
        queryParams.push(options.read ? 1 : 0);
      }
      
      // Add type filter if provided
      if (options.type) {
        query += ' AND type = ?';
        queryParams.push(options.type);
      }
      
      // Add sorting
      query += ' ORDER BY created_at DESC';
      
      // Add pagination
      if (options.limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(options.limit));
        
        if (options.offset) {
          query += ' OFFSET ?';
          queryParams.push(parseInt(options.offset));
        }
      }
      
      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {number} id - Notification ID
   * @returns {Promise} - Updated notification
   */
  static async markAsRead(id) {
    try {
      await pool.execute('UPDATE notifications SET is_read = ? WHERE id = ?', [true, id]);
      
      const [updatedNotification] = await pool.execute('SELECT * FROM notifications WHERE id = ?', [id]);
      return updatedNotification[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Number of updated notifications
   */
  static async markAllAsRead(userId) {
    try {
      const [result] = await pool.execute('UPDATE notifications SET is_read = ? WHERE user_id = ? AND is_read = ?', [true, userId, false]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete notification
   * @param {number} id - Notification ID
   * @returns {Promise} - Boolean indicating success
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM notifications WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete all notifications for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (read)
   * @returns {Promise} - Number of deleted notifications
   */
  static async deleteAllByUser(userId, options = {}) {
    try {
      let query = 'DELETE FROM notifications WHERE user_id = ?';
      const queryParams = [userId];
      
      // Add read filter if provided
      if (options.read !== undefined) {
        query += ' AND is_read = ?';
        queryParams.push(options.read ? 1 : 0);
      }
      
      const [result] = await pool.execute(query, queryParams);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Count of unread notifications
   */
  static async getUnreadCount(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = ?',
        [userId, false]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a system notification for a user
   * @param {number} userId - User ID
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {string} type - Notification type (info, warning, alert, success)
   * @returns {Promise} - Created notification
   */
  static async createSystemNotification(userId, title, message, type = 'info') {
    try {
      return await this.create({
        title,
        message,
        type,
        user_id: userId
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a cost alert notification for a user
   * @param {number} userId - User ID
   * @param {string} message - Alert message
   * @param {string} details - Alert details
   * @returns {Promise} - Created notification
   */
  static async createCostAlertNotification(userId, message, details = '') {
    try {
      return await this.create({
        title: 'Cost Alert',
        message: message,
        type: 'alert',
        user_id: userId
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a usage alert notification for a user
   * @param {number} userId - User ID
   * @param {string} message - Alert message
   * @param {string} details - Alert details
   * @returns {Promise} - Created notification
   */
  static async createUsageAlertNotification(userId, message, details = '') {
    try {
      return await this.create({
        title: 'Usage Alert',
        message: message,
        type: 'warning',
        user_id: userId
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a recommendation notification for a user
   * @param {number} userId - User ID
   * @param {string} message - Recommendation message
   * @param {string} details - Recommendation details
   * @returns {Promise} - Created notification
   */
  static async createRecommendationNotification(userId, message, details = '') {
    try {
      return await this.create({
        title: 'Recommendation',
        message: message,
        type: 'info',
        user_id: userId
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate sample notifications for a user
   * @param {number} userId - User ID
   * @param {number} count - Number of notifications to generate
   * @returns {Promise} - Array of created notifications
   */
  static async generateSampleNotifications(userId, count = 5) {
    try {
      const notificationTypes = [
        {
          title: 'Cost Alert',
          messages: [
            'Your monthly spending is approaching your budget limit.',
            'You have exceeded your monthly budget by 15%.',
            'Unusual spending detected in your account.'
          ],
          type: 'alert'
        },
        {
          title: 'Usage Alert',
          messages: [
            'Your data usage is approaching your monthly limit.',
            'Line +355 69 XXX XXX has exceeded its data limit.',
            'High usage detected on multiple lines.'
          ],
          type: 'warning'
        },
        {
          title: 'Recommendation',
          messages: [
            'We found a better plan that could save you €15 per month.',
            'Enabling data sharing between your lines could optimize your usage.',
            'Consider upgrading your plan to avoid overage charges.'
          ],
          type: 'info'
        },
        {
          title: 'Service Update',
          messages: [
            'Your service plan has been updated successfully.',
            'New features are now available for your business account.',
            'Maintenance scheduled for next week.'
          ],
          type: 'success'
        }
      ];
      
      const createdNotifications = [];
      
      for (let i = 0; i < count; i++) {
        // Select random notification type
        const typeIndex = Math.floor(Math.random() * notificationTypes.length);
        const notificationType = notificationTypes[typeIndex];
        
        // Select random message
        const messageIndex = Math.floor(Math.random() * notificationType.messages.length);
        const message = notificationType.messages[messageIndex];
        
        // Create notification
        const notification = await this.create({
          title: notificationType.title,
          message: message,
          type: notificationType.type,
          is_read: Math.random() > 0.7, // 30% chance of being read
          user_id: userId
        });
        
        createdNotifications.push(notification);
      }
      
      return createdNotifications;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Notification;
