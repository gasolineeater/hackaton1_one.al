import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
      <button 
        data-testid="login-button" 
        onClick={() => login('admin@onealb.com', 'password')}
      >
        Login
      </button>
      <button 
        data-testid="logout-button" 
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('provides initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
  });

  test('login function authenticates the user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click login button
    fireEvent.click(screen.getByTestId('login-button'));

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Check that user data is available
    expect(screen.getByTestId('user-email')).toHaveTextContent('john.doe@example.com');
  });

  test('logout function removes authentication', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    fireEvent.click(screen.getByTestId('login-button'));
    
    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Then logout
    fireEvent.click(screen.getByTestId('logout-button'));
    
    // Check that user is logged out
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
  });

  test('remembers user when rememberMe is true', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Mock the auth context's login function with rememberMe=true
    await act(async () => {
      const { login } = useAuth();
      await login('admin@onealb.com', 'password', true);
    });

    // Check localStorage
    expect(localStorage.getItem('user')).not.toBeNull();
    
    // Create a new instance to test if user is remembered
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // User should be authenticated immediately
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
  });
});
