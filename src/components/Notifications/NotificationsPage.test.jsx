import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import NotificationsPage from './NotificationsPage';
import { NotificationProvider } from '../../contexts/NotificationContext';

describe('NotificationsPage', () => {
  test('renders notifications list correctly', () => {
    render(
      <NotificationProvider>
        <NotificationsPage />
      </NotificationProvider>
    );

    // Check that the page title is rendered
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
    
    // Check that tabs are rendered
    expect(screen.getByRole('tab', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /alerts/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /billing/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /promotions/i })).toBeInTheDocument();
    
    // Check that the Mark All as Read button is rendered
    expect(screen.getByRole('button', { name: /mark all as read/i })).toBeInTheDocument();
    
    // Check that at least one notification is rendered
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  test('filters notifications by tab', () => {
    render(
      <NotificationProvider>
        <NotificationsPage />
      </NotificationProvider>
    );

    // Get the initial number of notifications
    const initialNotifications = screen.getAllByRole('listitem').length;
    
    // Click the Alerts tab
    fireEvent.click(screen.getByRole('tab', { name: /alerts/i }));
    
    // Get the number of alert notifications
    const alertNotifications = screen.getAllByRole('listitem').length;
    
    // Click the Billing tab
    fireEvent.click(screen.getByRole('tab', { name: /billing/i }));
    
    // Get the number of billing notifications
    const billingNotifications = screen.getAllByRole('listitem').length;
    
    // Click the Promotions tab
    fireEvent.click(screen.getByRole('tab', { name: /promotions/i }));
    
    // Get the number of promotion notifications
    const promotionNotifications = screen.getAllByRole('listitem').length;
    
    // Click the All tab
    fireEvent.click(screen.getByRole('tab', { name: /all/i }));
    
    // Get the number of all notifications
    const allNotifications = screen.getAllByRole('listitem').length;
    
    // Check that the sum of filtered notifications is less than or equal to all notifications
    expect(alertNotifications + billingNotifications + promotionNotifications).toBeLessThanOrEqual(allNotifications);
    
    // Check that the number of all notifications is equal to the initial number
    expect(allNotifications).toBe(initialNotifications);
  });

  test('marks a notification as read', async () => {
    render(
      <NotificationProvider>
        <NotificationsPage />
      </NotificationProvider>
    );

    // Find an unread notification (with "New" chip)
    const newChips = screen.queryAllByText('New');
    if (newChips.length > 0) {
      // Get the notification item
      const notificationItem = newChips[0].closest('li');
      
      // Open the menu for this notification
      const menuButton = notificationItem.querySelector('[aria-label="more"]');
      fireEvent.click(menuButton);
      
      // Click the "Mark as read" option
      fireEvent.click(screen.getByText(/mark as read/i));
      
      // Check that the notification no longer has the "New" chip
      expect(notificationItem).not.toContainElement(screen.queryByText('New'));
      
      // Check that a success message is shown
      await waitFor(() => {
        expect(screen.getByText(/notification marked as read/i)).toBeInTheDocument();
      });
    }
  });

  test('deletes a notification', async () => {
    render(
      <NotificationProvider>
        <NotificationsPage />
      </NotificationProvider>
    );

    // Get the initial number of notifications
    const initialNotifications = screen.getAllByRole('listitem').length;
    
    // Get the first notification
    const notificationItem = screen.getAllByRole('listitem')[0];
    
    // Open the menu for this notification
    const menuButton = notificationItem.querySelector('[aria-label="more"]');
    fireEvent.click(menuButton);
    
    // Click the "Delete" option
    fireEvent.click(screen.getByText(/delete/i));
    
    // Check that the number of notifications has decreased
    expect(screen.getAllByRole('listitem').length).toBe(initialNotifications - 1);
    
    // Check that a success message is shown
    await waitFor(() => {
      expect(screen.getByText(/notification deleted/i)).toBeInTheDocument();
    });
  });

  test('marks all notifications as read', async () => {
    render(
      <NotificationProvider>
        <NotificationsPage />
      </NotificationProvider>
    );

    // Check if there are any unread notifications
    const newChips = screen.queryAllByText('New');
    if (newChips.length > 0) {
      // Click the "Mark All as Read" button
      fireEvent.click(screen.getByRole('button', { name: /mark all as read/i }));
      
      // Check that there are no more "New" chips
      expect(screen.queryByText('New')).not.toBeInTheDocument();
      
      // Check that a success message is shown
      await waitFor(() => {
        expect(screen.getByText(/all notifications marked as read/i)).toBeInTheDocument();
      });
    }
  });

  test('shows empty state when no notifications match filter', () => {
    // Mock the useNotifications hook to return empty notifications for a specific type
    jest.mock('../../contexts/NotificationContext', () => ({
      ...jest.requireActual('../../contexts/NotificationContext'),
      useNotifications: () => ({
        notifications: [],
        unreadCount: 0,
        markAsRead: jest.fn(),
        markAllAsRead: jest.fn(),
        deleteNotification: jest.fn(),
      }),
    }));

    render(<NotificationsPage />);
    
    // Click a tab that would have no notifications
    fireEvent.click(screen.getByRole('tab', { name: /promotions/i }));
    
    // Check that the empty state message is shown
    expect(screen.getByText(/no notifications to display/i)).toBeInTheDocument();
  });
});
