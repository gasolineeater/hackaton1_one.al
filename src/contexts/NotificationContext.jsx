import React, { createContext, useState, useEffect, useContext } from 'react';
import { notificationsService } from '../services/api.service';
import { useAuth } from './AuthContext';

// Create notification context
const NotificationContext = createContext();

/**
 * Notification Provider Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Provider component
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useAuth();

  // Load notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Set up polling for unread count
      const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  /**
   * Fetch all notifications
   * @param {Object} options - Query options
   * @returns {Promise} - Resolved with notifications
   */
  const fetchNotifications = async (options = {}) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await notificationsService.getAllNotifications(options);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      return data;
    } catch (error) {
      setError(error);
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch unread notification count
   * @returns {Promise} - Resolved with unread count
   */
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await notificationsService.getUnreadCount();
      setUnreadCount(data.unreadCount);
      return data.unreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise} - Resolved with updated notification
   */
  const markAsRead = async (id) => {
    try {
      const updatedNotification = await notificationsService.markAsRead(id);
      
      // Update notifications list
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
      
      // Update unread count
      fetchUnreadCount();
      
      return updatedNotification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  /**
   * Mark all notifications as read
   * @returns {Promise} - Resolved with success message
   */
  const markAllAsRead = async () => {
    try {
      const result = await notificationsService.markAllAsRead();
      
      // Update notifications list
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, is_read: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
      
      return result;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  /**
   * Delete notification
   * @param {string} id - Notification ID
   * @returns {Promise} - Resolved with success message
   */
  const deleteNotification = async (id) => {
    try {
      const result = await notificationsService.deleteNotification(id);
      
      // Update notifications list
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== id)
      );
      
      // Update unread count if needed
      const deletedNotification = notifications.find(n => n.id === id);
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  /**
   * Delete all notifications
   * @param {Object} options - Query options
   * @returns {Promise} - Resolved with success message
   */
  const deleteAllNotifications = async (options = {}) => {
    try {
      const result = await notificationsService.deleteAllNotifications(options);
      
      // Update notifications list
      if (options.read === undefined) {
        setNotifications([]);
        setUnreadCount(0);
      } else if (options.read) {
        setNotifications(prevNotifications =>
          prevNotifications.filter(notification => !notification.is_read)
        );
      } else {
        setNotifications(prevNotifications =>
          prevNotifications.filter(notification => notification.is_read)
        );
        setUnreadCount(0);
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  };

  /**
   * Generate sample notifications
   * @param {number} count - Number of notifications to generate
   * @returns {Promise} - Resolved with generated notifications
   */
  const generateSampleNotifications = async (count = 5) => {
    try {
      const result = await notificationsService.generateSampleNotifications(count);
      
      // Refresh notifications
      fetchNotifications();
      
      return result;
    } catch (error) {
      console.error('Error generating sample notifications:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    generateSampleNotifications
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

/**
 * Custom hook to use notification context
 * @returns {Object} - Notification context value
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;
