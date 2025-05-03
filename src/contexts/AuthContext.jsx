import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, getUser, removeUser, removeToken } from '../services/api.service';

// Create authentication context
const AuthContext = createContext();

/**
 * Authentication Provider Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Provider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from local storage on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getUser();
        
        if (storedUser) {
          // Verify token by fetching user profile
          try {
            const profile = await authService.getProfile();
            setUser(profile);
          } catch (error) {
            // Token is invalid or expired
            console.error('Authentication error:', error);
            removeUser();
            removeToken();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Resolved with user data
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Resolved with user data
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   */
  const updateProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use authentication context
 * @returns {Object} - Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
