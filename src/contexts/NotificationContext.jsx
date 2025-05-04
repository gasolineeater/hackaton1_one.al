import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const NotificationContext = createContext();

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: 'Data Usage Alert',
    message: 'Line +355 69 123 4567 has reached 80% of data limit',
    type: 'alert',
    time: '2 hours ago',
    read: false,
    color: 'warning'
  },
  {
    id: 2,
    title: 'Bill Payment Reminder',
    message: 'Your monthly bill of €350.75 is due in 3 days',
    type: 'billing',
    time: '1 day ago',
    read: false,
    color: 'info'
  },
  {
    id: 3,
    title: 'New Service Available',
    message: 'International Roaming Plus is now available for your business',
    type: 'promotion',
    time: '3 days ago',
    read: true,
    color: 'success'
  },
  {
    id: 4,
    title: 'Service Interruption',
    message: 'Scheduled maintenance on July 15th from 2AM to 4AM',
    type: 'system',
    time: '5 days ago',
    read: true,
    color: 'error'
  },
  {
    id: 5,
    title: 'Cost Saving Opportunity',
    message: 'Switch to our new Business Premium plan and save €50/month',
    type: 'recommendation',
    time: '1 week ago',
    read: true,
    color: 'primary'
  }
];

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(), // Simple way to generate unique ID
      read: false,
      time: 'Just now',
      ...notification
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };

  // Context value
  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
