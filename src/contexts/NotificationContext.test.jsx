import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationProvider, useNotifications } from './NotificationContext';

// Test component that uses the notification context
const TestComponent = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    addNotification 
  } = useNotifications();

  return (
    <div>
      <div data-testid="notification-count">{notifications.length}</div>
      <div data-testid="unread-count">{unreadCount}</div>
      
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} data-testid={`notification-${notification.id}`}>
            {notification.title}
            {notification.read ? ' (Read)' : ' (Unread)'}
            <button 
              data-testid={`mark-read-${notification.id}`} 
              onClick={() => markAsRead(notification.id)}
            >
              Mark as Read
            </button>
            <button 
              data-testid={`delete-${notification.id}`} 
              onClick={() => deleteNotification(notification.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      <button 
        data-testid="mark-all-read" 
        onClick={markAllAsRead}
      >
        Mark All as Read
      </button>
      
      <button 
        data-testid="add-notification" 
        onClick={() => addNotification({
          title: 'Test Notification',
          message: 'This is a test notification',
          type: 'test',
          color: 'primary'
        })}
      >
        Add Notification
      </button>
    </div>
  );
};

describe('NotificationContext', () => {
  test('provides initial notifications', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Check that initial notifications are provided
    expect(screen.getByTestId('notification-count')).not.toHaveTextContent('0');
  });

  test('calculates unread count correctly', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Get the unread count from the context
    const unreadCount = parseInt(screen.getByTestId('unread-count').textContent);
    
    // Count unread notifications manually
    const unreadNotifications = screen.getAllByText(/\(Unread\)/).length;
    
    // Compare the counts
    expect(unreadCount).toBe(unreadNotifications);
  });

  test('markAsRead function marks a notification as read', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Find an unread notification
    const unreadNotifications = screen.getAllByText(/\(Unread\)/);
    if (unreadNotifications.length > 0) {
      // Get the notification ID
      const notificationElement = unreadNotifications[0].closest('li');
      const notificationId = notificationElement.dataset.testid.split('-')[1];
      
      // Click the mark as read button
      fireEvent.click(screen.getByTestId(`mark-read-${notificationId}`));
      
      // Check that the notification is now marked as read
      expect(notificationElement).toHaveTextContent('(Read)');
      
      // Check that the unread count has decreased
      const initialUnreadCount = unreadNotifications.length;
      const newUnreadCount = screen.getAllByText(/\(Unread\)/).length;
      expect(newUnreadCount).toBe(initialUnreadCount - 1);
    }
  });

  test('markAllAsRead function marks all notifications as read', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Click the mark all as read button
    fireEvent.click(screen.getByTestId('mark-all-read'));
    
    // Check that all notifications are marked as read
    expect(screen.queryAllByText(/\(Unread\)/).length).toBe(0);
    expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
  });

  test('deleteNotification function removes a notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Get the initial notification count
    const initialCount = parseInt(screen.getByTestId('notification-count').textContent);
    
    // Get the first notification
    const notifications = screen.getAllByTestId(/^notification-\d+$/);
    if (notifications.length > 0) {
      // Get the notification ID
      const notificationId = notifications[0].dataset.testid.split('-')[1];
      
      // Click the delete button
      fireEvent.click(screen.getByTestId(`delete-${notificationId}`));
      
      // Check that the notification count has decreased
      expect(screen.getByTestId('notification-count')).toHaveTextContent(String(initialCount - 1));
      
      // Check that the notification is no longer in the DOM
      expect(screen.queryByTestId(`notification-${notificationId}`)).not.toBeInTheDocument();
    }
  });

  test('addNotification function adds a new notification', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Get the initial notification count
    const initialCount = parseInt(screen.getByTestId('notification-count').textContent);
    
    // Click the add notification button
    fireEvent.click(screen.getByTestId('add-notification'));
    
    // Check that the notification count has increased
    expect(screen.getByTestId('notification-count')).toHaveTextContent(String(initialCount + 1));
    
    // Check that the new notification is in the DOM
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    
    // Check that the new notification is unread
    expect(screen.getByText('Test Notification').closest('li')).toHaveTextContent('(Unread)');
  });
});
