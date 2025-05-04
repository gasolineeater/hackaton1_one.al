import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import LoginPage from './LoginPage';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the router navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks before each test
    localStorage.clear();
    mockNavigate.mockReset();
  });

  test('renders login form correctly', () => {
    render(<LoginPage />);

    // Check that form elements are rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  test('validates form inputs', () => {
    render(<LoginPage />);

    // Get form elements
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    // Button should be disabled initially
    expect(submitButton).toBeDisabled();

    // Fill in email only
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(submitButton).toBeDisabled();

    // Fill in password only
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    expect(submitButton).toBeDisabled();

    // Fill in both fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(submitButton).not.toBeDisabled();
  });

  test('shows error message for invalid credentials', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Get form elements
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    // Fill in invalid credentials
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });

    // Navigate should not have been called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('navigates to dashboard on successful login', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Get form elements
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    // Fill in valid credentials
    fireEvent.change(emailInput, { target: { value: 'admin@onealb.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('remembers user when remember me is checked', async () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Get form elements
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    // Fill in valid credentials and check remember me
    fireEvent.change(emailInput, { target: { value: 'admin@onealb.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(rememberMeCheckbox);

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // Check that user is stored in localStorage
    expect(localStorage.getItem('user')).not.toBeNull();
  });

  test('toggles password visibility', () => {
    render(<LoginPage />);

    // Get password input and visibility toggle button
    const passwordInput = screen.getByLabelText(/password/i);
    const visibilityToggle = screen.getByLabelText(/toggle password visibility/i);

    // Password should be hidden initially
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the visibility toggle
    fireEvent.click(visibilityToggle);

    // Password should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click the visibility toggle again
    fireEvent.click(visibilityToggle);

    // Password should be hidden again
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
