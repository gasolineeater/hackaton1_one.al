import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

/**
 * @route GET /api/notifications
 * @desc Get user notifications
 * @access Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      limit = 20, 
      offset = 0, 
      includeRead = false,
      category,
      type,
      sort = 'newest'
    } = req.query;
    
    const result = await notificationService.getUserNotifications(userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      includeRead: includeRead === 'true',
      category,
      type,
      sort
    });
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get notifications',
      error: error.message
    });
  }
});

/**
 * @route GET /api/notifications/customer/:customerId
 * @desc Get customer notifications
 * @access Private (Admin or Customer Manager)
 */
router.get('/customer/:customerId', authenticate, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const { customerId } = req.params;
    const { 
      limit = 20, 
      offset = 0, 
      includeRead = false,
      category,
      type,
      sort = 'newest'
    } = req.query;
    
    // Check if user has access to this customer
    if (req.user.role !== 'admin' && req.user.customerId !== parseInt(customerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this customer\'s notifications'
      });
    }
    
    const result = await notificationService.getCustomerNotifications(customerId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      includeRead: includeRead === 'true',
      category,
      type,
      sort
    });
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error getting customer notifications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get customer notifications',
      error: error.message
    });
  }
});

/**
 * @route GET /api/notifications/unread-count
 * @desc Get unread notification count
 * @access Private
 */
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);
    
    res.json({
      status: 'success',
      data: {
        unreadCount: count
      }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get unread count',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/mark-read/:id
 * @desc Mark notification as read
 * @access Private
 */
router.post('/mark-read/:id', authenticate, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    
    const result = await notificationService.markAsRead(notificationId, userId);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/mark-all-read
 * @desc Mark all notifications as read
 * @access Private
 */
router.post('/mark-all-read', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await notificationService.markAllAsRead(userId);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete notification
 * @access Private
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    
    const result = await notificationService.deleteNotification(notificationId, userId);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete notification',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/create
 * @desc Create notification (admin only)
 * @access Private (Admin)
 */
router.post('/create', authenticate, authorize('admin'), async (req, res) => {
  try {
    const notificationData = req.body;
    
    const result = await notificationService.createNotification(notificationData);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.status(201).json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create notification',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/create-from-template
 * @desc Create notification from template (admin only)
 * @access Private (Admin)
 */
router.post('/create-from-template', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { templateName, data, recipients } = req.body;
    
    if (!templateName) {
      return res.status(400).json({
        status: 'error',
        message: 'Template name is required'
      });
    }
    
    const result = await notificationService.createFromTemplate(templateName, data, recipients);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.status(201).json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error creating notification from template:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create notification from template',
      error: error.message
    });
  }
});

/**
 * @route GET /api/notifications/templates
 * @desc Get all notification templates (admin only)
 * @access Private (Admin)
 */
router.get('/templates', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { 
      limit = 20, 
      offset = 0,
      category,
      type,
      activeOnly = true
    } = req.query;
    
    const result = await notificationService.getAllTemplates({
      limit: parseInt(limit),
      offset: parseInt(offset),
      category,
      type,
      activeOnly: activeOnly === 'true'
    });
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error getting notification templates:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get notification templates',
      error: error.message
    });
  }
});

/**
 * @route GET /api/notifications/templates/:name
 * @desc Get notification template by name (admin only)
 * @access Private (Admin)
 */
router.get('/templates/:name', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name } = req.params;
    
    const result = await notificationService.getTemplate(name);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error getting notification template:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get notification template',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/templates
 * @desc Create notification template (admin only)
 * @access Private (Admin)
 */
router.post('/templates', authenticate, authorize('admin'), async (req, res) => {
  try {
    const templateData = req.body;
    
    const result = await notificationService.createTemplate(templateData);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.status(201).json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error creating notification template:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create notification template',
      error: error.message
    });
  }
});

/**
 * @route PUT /api/notifications/templates/:name
 * @desc Update notification template (admin only)
 * @access Private (Admin)
 */
router.put('/templates/:name', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name } = req.params;
    const templateData = req.body;
    
    const result = await notificationService.updateTemplate(name, templateData);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error updating notification template:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update notification template',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/notifications/templates/:name
 * @desc Delete notification template (admin only)
 * @access Private (Admin)
 */
router.delete('/templates/:name', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name } = req.params;
    
    const result = await notificationService.deleteTemplate(name);
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification template:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete notification template',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/cleanup
 * @desc Clean up old notifications (admin only)
 * @access Private (Admin)
 */
router.post('/cleanup', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { days = 30 } = req.body;
    
    const result = await notificationService.cleanupOldNotifications(parseInt(days));
    
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }
    
    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clean up notifications',
      error: error.message
    });
  }
});

export default router;
