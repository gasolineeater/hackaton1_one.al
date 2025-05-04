import React from 'react';
import { render, screen, fireEvent } from '../../utils/test-utils';
import Header from './Header';
import { AuthProvider } from '../../contexts/AuthContext';
import { NotificationProvider } from '../../contexts/NotificationContext';

// Mock the router navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
}));

describe('Header', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockReset();
  });

  test('renders navigation menu items correctly', () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <Header />
        </NotificationProvider>
      </AuthProvider>
    );

    // Check that the logo is rendered
    expect(screen.getByAltText(/one albania logo/i)).toBeInTheDocument();
    
    // Check that navigation menu items are rendered
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/service overview/i)).toBeInTheDocument();
    expect(screen.getByText(/cost control/i)).toBeInTheDocument();
    expect(screen.getByText(/service management/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/ai recommendations/i)).toBeInTheDocument();
  });

  test('navigates to the correct page when menu item is clicked', () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <Header />
        </NotificationProvider>
      </AuthProvider>
    );

    // Click the Service Overview menu item
    fireEvent.click(screen.getByText(/service overview/i));
    
    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/service-overview');
    
    // Click the Cost Control menu item
    fireEvent.click(screen.getByText(/cost control/i));
    
    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/cost-control');
  });

  test('opens notifications menu when notifications icon is clicked', () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <Header />
        </NotificationProvider>
      </AuthProvider>
    );

    // Click the notifications icon
    fireEvent.click(screen.getByLabelText(/notifications/i));
    
    // Check that the notifications menu is opened
    expect(screen.getByRole('menu')).toBeInTheDocument();
    
    // Check that at least one notification is shown
    expect(screen.getAllByRole('menuitem').length).toBeGreaterThan(0);
  });

  test('opens profile menu when profile icon is clicked', () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <Header />
        </NotificationProvider>
      </AuthProvider>
    );

    // Click the profile icon
    fireEvent.click(screen.getByLabelText(/account/i));
    
    // Check that the profile menu is opened
    expect(screen.getByRole('menu')).toBeInTheDocument();
    
    // Check that profile menu items are shown
    expect(screen.getByText(/my profile/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('navigates to settings page when settings icon is clicked', () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <Header />
        </NotificationProvider>
      </AuthProvider>
    );

    // Click the settings icon
    fireEvent.click(screen.getByLabelText(/settings/i));
    
    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  test('logs out when logout menu item is clicked', () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <Header />
        </NotificationProvider>
      </AuthProvider>
    );

    // Click the profile icon to open the menu
    fireEvent.click(screen.getByLabelText(/account/i));
    
    // Click the logout menu item
    fireEvent.click(screen.getByText(/logout/i));
    
    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('displays notification badge with correct count', () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <Header />
        </NotificationProvider>
      </AuthProvider>
    );

    // Check that the notification badge is rendered
    const badge = screen.getByLabelText(/notifications/i).querySelector('.MuiBadge-badge');
    expect(badge).toBeInTheDocument();
    
    // Check that the badge has a number
    expect(parseInt(badge.textContent)).toBeGreaterThanOrEqual(0);
  });

  test('opens mobile menu on small screens', () => {
    // Mock window.innerWidth to simulate a small screen
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600, // Mobile width
    });
    
    // Trigger a resize event
    window.dispatchEvent(new Event('resize'));

    render(
      <AuthProvider>
        <NotificationProvider>
          <Header />
        </NotificationProvider>
      </AuthProvider>
    );

    // Check that the mobile menu button is rendered
    const menuButton = screen.getByLabelText(/open drawer/i);
    expect(menuButton).toBeInTheDocument();
    
    // Click the menu button
    fireEvent.click(menuButton);
    
    // Check that the mobile menu is opened
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    
    // Check that menu items are shown
    expect(screen.getAllByText(/dashboard/i)[1]).toBeInTheDocument(); // There are two instances now
    expect(screen.getAllByText(/service overview/i)[1]).toBeInTheDocument();
  });
});
