import React from 'react';
import { render, screen, waitFor } from '../../utils/test-utils';
import LogoutPage from './LogoutPage';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the router navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the logout function
const mockLogout = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

describe('LogoutPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockReset();
    mockLogout.mockReset();
    
    // Reset timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore timers
    jest.useRealTimers();
  });

  test('renders logout message correctly', () => {
    render(
      <AuthProvider>
        <LogoutPage />
      </AuthProvider>
    );

    // Check that the logout message is rendered
    expect(screen.getByText(/logging out/i)).toBeInTheDocument();
    expect(screen.getByText(/thank you for using/i)).toBeInTheDocument();
    
    // Check that the loading indicator is rendered
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Check that the return to login button is rendered
    expect(screen.getByRole('button', { name: /return to login/i })).toBeInTheDocument();
  });

  test('automatically logs out and redirects after delay', async () => {
    render(
      <AuthProvider>
        <LogoutPage />
      </AuthProvider>
    );

    // Fast-forward timers
    jest.advanceTimersByTime(2000);
    
    // Check that logout was called
    expect(mockLogout).toHaveBeenCalled();
    
    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to login page when return button is clicked', () => {
    render(
      <AuthProvider>
        <LogoutPage />
      </AuthProvider>
    );

    // Click the return to login button
    const returnButton = screen.getByRole('button', { name: /return to login/i });
    returnButton.click();
    
    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('cleans up timer on unmount', () => {
    // Spy on clearTimeout
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    
    const { unmount } = render(
      <AuthProvider>
        <LogoutPage />
      </AuthProvider>
    );
    
    // Unmount the component
    unmount();
    
    // Check that clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    // Restore the spy
    clearTimeoutSpy.mockRestore();
  });
});
