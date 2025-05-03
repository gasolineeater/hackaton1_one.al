import { Op } from 'sequelize';
import { Notification, NotificationTemplate, User, Customer } from '../models/index.js';
import emailService from './emailService.js';
import smsService from './smsService.js';

/**
 * Service for notification operations
 * Handles notification creation, delivery, and management
 */
class NotificationService {
  /**
   * Create a notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(notificationData) {
    try {
      const notification = await Notification.create(notificationData);
      
      // Deliver notification based on delivery method
      if (notification.deliveryMethod !== 'in-app') {
        await this.deliverNotification(notification);
      }
      
      return {
        success: true,
        data: notification
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Create a notification from template
   * @param {string} templateName - Template name
   * @param {Object} data - Data for template variables
   * @param {Object} recipients - Recipient information
   * @returns {Promise<Object>} Created notification
   */
  async createFromTemplate(templateName, data = {}, recipients = {}) {
    try {
      // Get template
      const template = await NotificationTemplate.findOne({
        where: {
          name: templateName,
          isActive: true
        }
      });
      
      if (!template) {
        return {
          success: false,
          error: \`Template "\${templateName}" not found or inactive\`
        };
      }
      
      // Replace template variables
      const title = this.replaceTemplateVariables(template.titleTemplate, data);
      const message = this.replaceTemplateVariables(template.messageTemplate, data);
      const actionUrl = template.actionUrlTemplate ? 
        this.replaceTemplateVariables(template.actionUrlTemplate, data) : null;
      
      // Create notification object
      const notificationData = {
        title,
        message,
        type: template.type,
        category: template.category,
        priority: template.priority,
        actionUrl,
        deliveryMethod: recipients.deliveryMethod || template.defaultDeliveryMethod,
        metadata: data
      };
      
      // Set expiry date if template has expiry days
      if (template.expiryDays) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + template.expiryDays);
        notificationData.expiresAt = expiresAt;
      }
      
      // Add recipient information
      if (recipients.userId) {
        notificationData.userId = recipients.userId;
      }
      
      if (recipients.customerId) {
        notificationData.customerId = recipients.customerId;
      }
      
      // Create notification
      return await this.createNotification(notificationData);
    } catch (error) {
      console.error('Error creating notification from template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Replace template variables with actual values
   * @param {string} template - Template string
   * @param {Object} data - Data for variables
   * @returns {string} Processed string
   */
  replaceTemplateVariables(template, data) {
    if (!template) return '';
    
    return template.replace(/\\{\\{([^}]+)\\}\\}/g, (match, key) => {
      const keys = key.trim().split('.');
      let value = data;
      
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      
      return value !== undefined ? value : match;
    });
  }
  
  /**
   * Deliver notification via email or SMS
   * @param {Object} notification - Notification object
   * @returns {Promise<Object>} Delivery result
   */
  async deliverNotification(notification) {
    try {
      let deliveryResult = { success: false };
      
      // Get user information if userId is provided
      let user = null;
      if (notification.userId) {
        user = await User.findByPk(notification.userId);
      }
      
      // Get customer information if customerId is provided
      let customer = null;
      if (notification.customerId) {
        customer = await Customer.findByPk(notification.customerId);
      }
      
      // Deliver based on method
      switch (notification.deliveryMethod) {
        case 'email':
          deliveryResult = await this.deliverEmail(notification, user, customer);
          break;
        case 'sms':
          deliveryResult = await this.deliverSms(notification, user, customer);
          break;
        case 'all':
          const emailResult = await this.deliverEmail(notification, user, customer);
          const smsResult = await this.deliverSms(notification, user, customer);
          deliveryResult = {
            success: emailResult.success || smsResult.success,
            email: emailResult,
            sms: smsResult
          };
          break;
      }
      
      // Update notification delivery status
      await notification.update({
        deliveryStatus: deliveryResult.success ? 'delivered' : 'failed'
      });
      
      return deliveryResult;
    } catch (error) {
      console.error('Error delivering notification:', error);
      
      // Update notification delivery status
      await notification.update({
        deliveryStatus: 'failed'
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Deliver notification via email
   * @param {Object} notification - Notification object
   * @param {Object} user - User object
   * @param {Object} customer - Customer object
   * @returns {Promise<Object>} Email delivery result
   */
  async deliverEmail(notification, user, customer) {
    try {
      // Get email address
      let email = null;
      
      if (user) {
        email = user.email;
      } else if (customer) {
        email = customer.email;
      }
      
      if (!email) {
        return {
          success: false,
          error: 'No email address found for recipient'
        };
      }
      
      // Get template for this notification
      const template = await NotificationTemplate.findOne({
        where: {
          category: notification.category,
          type: notification.type
        }
      });
      
      // Prepare email content
      const subject = template?.emailSubjectTemplate ? 
        this.replaceTemplateVariables(template.emailSubjectTemplate, notification.metadata) : 
        notification.title;
      
      const body = template?.emailBodyTemplate ? 
        this.replaceTemplateVariables(template.emailBodyTemplate, notification.metadata) : 
        notification.message;
      
      // Send email
      return await emailService.sendEmail({
        to: email,
        subject,
        body,
        isHtml: true
      });
    } catch (error) {
      console.error('Error delivering email notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Deliver notification via SMS
   * @param {Object} notification - Notification object
   * @param {Object} user - User object
   * @param {Object} customer - Customer object
   * @returns {Promise<Object>} SMS delivery result
   */
  async deliverSms(notification, user, customer) {
    try {
      // Get phone number
      let phone = null;
      
      if (user) {
        phone = user.phoneNumber;
      } else if (customer) {
        phone = customer.phone;
      }
      
      if (!phone) {
        return {
          success: false,
          error: 'No phone number found for recipient'
        };
      }
      
      // Get template for this notification
      const template = await NotificationTemplate.findOne({
        where: {
          category: notification.category,
          type: notification.type
        }
      });
      
      // Prepare SMS content
      const message = template?.smsTemplate ? 
        this.replaceTemplateVariables(template.smsTemplate, notification.metadata) : 
        notification.title;
      
      // Send SMS
      return await smsService.sendSms({
        to: phone,
        message
      });
    } catch (error) {
      console.error('Error delivering SMS notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get notifications for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Notifications
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const { 
        limit = 20, 
        offset = 0, 
        includeRead = false,
        category = null,
        type = null,
        sort = 'newest'
      } = options;
      
      // Build where clause
      const whereClause = {
        userId,
        isDeleted: false
      };
      
      if (!includeRead) {
        whereClause.isRead = false;
      }
      
      if (category) {
        whereClause.category = category;
      }
      
      if (type) {
        whereClause.type = type;
      }
      
      // Build order clause
      const orderClause = [];
      
      if (sort === 'newest') {
        orderClause.push(['createdAt', 'DESC']);
      } else if (sort === 'oldest') {
        orderClause.push(['createdAt', 'ASC']);
      } else if (sort === 'priority') {
        orderClause.push(['priority', 'DESC']);
        orderClause.push(['createdAt', 'DESC']);
      }
      
      // Get notifications
      const { count, rows } = await Notification.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: orderClause
      });
      
      return {
        success: true,
        data: {
          total: count,
          notifications: rows,
          unreadCount: await this.getUnreadCount(userId)
        }
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get notifications for a customer
   * @param {number} customerId - Customer ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Notifications
   */
  async getCustomerNotifications(customerId, options = {}) {
    try {
      const { 
        limit = 20, 
        offset = 0, 
        includeRead = false,
        category = null,
        type = null,
        sort = 'newest'
      } = options;
      
      // Build where clause
      const whereClause = {
        customerId,
        isDeleted: false
      };
      
      if (!includeRead) {
        whereClause.isRead = false;
      }
      
      if (category) {
        whereClause.category = category;
      }
      
      if (type) {
        whereClause.type = type;
      }
      
      // Build order clause
      const orderClause = [];
      
      if (sort === 'newest') {
        orderClause.push(['createdAt', 'DESC']);
      } else if (sort === 'oldest') {
        orderClause.push(['createdAt', 'ASC']);
      } else if (sort === 'priority') {
        orderClause.push(['priority', 'DESC']);
        orderClause.push(['createdAt', 'DESC']);
      }
      
      // Get notifications
      const { count, rows } = await Notification.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: orderClause
      });
      
      return {
        success: true,
        data: {
          total: count,
          notifications: rows,
          unreadCount: await this.getUnreadCount(null, customerId)
        }
      };
    } catch (error) {
      console.error('Error getting customer notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<Object>} Result
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findByPk(notificationId);
      
      if (!notification) {
        return {
          success: false,
          error: 'Notification not found'
        };
      }
      
      // Check if user owns this notification
      if (notification.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized'
        };
      }
      
      // Update notification
      await notification.update({
        isRead: true,
        readAt: new Date()
      });
      
      return {
        success: true,
        data: notification
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Mark all notifications as read
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Result
   */
  async markAllAsRead(userId) {
    try {
      // Update all unread notifications for this user
      const [updatedCount] = await Notification.update(
        {
          isRead: true,
          readAt: new Date()
        },
        {
          where: {
            userId,
            isRead: false,
            isDeleted: false
          }
        }
      );
      
      return {
        success: true,
        data: {
          updatedCount
        }
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Delete notification
   * @param {number} notificationId - Notification ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<Object>} Result
   */
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findByPk(notificationId);
      
      if (!notification) {
        return {
          success: false,
          error: 'Notification not found'
        };
      }
      
      // Check if user owns this notification
      if (notification.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized'
        };
      }
      
      // Update notification
      await notification.update({
        isDeleted: true
      });
      
      return {
        success: true,
        data: notification
      };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get unread notification count
   * @param {number} userId - User ID
   * @param {number} customerId - Customer ID
   * @returns {Promise<number>} Unread count
   */
  async getUnreadCount(userId = null, customerId = null) {
    try {
      const whereClause = {
        isRead: false,
        isDeleted: false
      };
      
      if (userId) {
        whereClause.userId = userId;
      }
      
      if (customerId) {
        whereClause.customerId = customerId;
      }
      
      const count = await Notification.count({
        where: whereClause
      });
      
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
  
  /**
   * Create notification template
   * @param {Object} templateData - Template data
   * @returns {Promise<Object>} Created template
   */
  async createTemplate(templateData) {
    try {
      const template = await NotificationTemplate.create(templateData);
      
      return {
        success: true,
        data: template
      };
    } catch (error) {
      console.error('Error creating notification template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get notification template
   * @param {string} name - Template name
   * @returns {Promise<Object>} Template
   */
  async getTemplate(name) {
    try {
      const template = await NotificationTemplate.findOne({
        where: {
          name
        }
      });
      
      if (!template) {
        return {
          success: false,
          error: 'Template not found'
        };
      }
      
      return {
        success: true,
        data: template
      };
    } catch (error) {
      console.error('Error getting notification template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Update notification template
   * @param {string} name - Template name
   * @param {Object} templateData - Template data
   * @returns {Promise<Object>} Updated template
   */
  async updateTemplate(name, templateData) {
    try {
      const template = await NotificationTemplate.findOne({
        where: {
          name
        }
      });
      
      if (!template) {
        return {
          success: false,
          error: 'Template not found'
        };
      }
      
      // Update template
      await template.update(templateData);
      
      return {
        success: true,
        data: template
      };
    } catch (error) {
      console.error('Error updating notification template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Delete notification template
   * @param {string} name - Template name
   * @returns {Promise<Object>} Result
   */
  async deleteTemplate(name) {
    try {
      const template = await NotificationTemplate.findOne({
        where: {
          name
        }
      });
      
      if (!template) {
        return {
          success: false,
          error: 'Template not found'
        };
      }
      
      // Delete template
      await template.destroy();
      
      return {
        success: true,
        message: 'Template deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting notification template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get all notification templates
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Templates
   */
  async getAllTemplates(options = {}) {
    try {
      const { 
        limit = 20, 
        offset = 0,
        category = null,
        type = null,
        activeOnly = true
      } = options;
      
      // Build where clause
      const whereClause = {};
      
      if (activeOnly) {
        whereClause.isActive = true;
      }
      
      if (category) {
        whereClause.category = category;
      }
      
      if (type) {
        whereClause.type = type;
      }
      
      // Get templates
      const { count, rows } = await NotificationTemplate.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['name', 'ASC']]
      });
      
      return {
        success: true,
        data: {
          total: count,
          templates: rows
        }
      };
    } catch (error) {
      console.error('Error getting notification templates:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Clean up old notifications
   * @param {number} days - Days to keep
   * @returns {Promise<Object>} Result
   */
  async cleanupOldNotifications(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      // Delete old notifications
      const deletedCount = await Notification.destroy({
        where: {
          createdAt: {
            [Op.lt]: cutoffDate
          },
          isRead: true
        }
      });
      
      return {
        success: true,
        data: {
          deletedCount
        }
      };
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export a singleton instance
export default new NotificationService();
