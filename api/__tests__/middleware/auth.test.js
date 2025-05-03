import { authenticate, authorize } from '../../middleware/auth.js';
import { generateTestToken } from '../utils/testUtils.js';
import { AppError } from '../../middleware/errorMiddleware.js';

// Mock dependencies
jest.mock('../../utils/logger.js');

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Setup request, response, and next function mocks
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('authenticate', () => {
    it('should call next() when a valid token is provided', () => {
      // Generate a valid test token
      const token = generateTestToken();
      req.headers.authorization = `Bearer ${token}`;

      // Call the middleware
      authenticate(req, res, next);

      // Expect next to be called with no arguments
      expect(next).toHaveBeenCalledWith();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(1);
      expect(req.user.username).toBe('testuser');
    });

    it('should return 401 when no token is provided', () => {
      // Call the middleware with no token
      authenticate(req, res, next);

      // Expect next to be called with an AppError
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('should return 401 when an invalid token is provided', () => {
      // Set an invalid token
      req.headers.authorization = 'Bearer invalid.token.here';

      // Call the middleware
      authenticate(req, res, next);

      // Expect next to be called with an AppError
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Invalid or expired token');
    });
  });

  describe('authorize', () => {
    beforeEach(() => {
      // Setup a user in the request
      req.user = {
        id: 1,
        username: 'testuser',
        role: 'user'
      };
    });

    it('should call next() when user has the required role', () => {
      // Create authorize middleware with 'user' role
      const authMiddleware = authorize('user');

      // Call the middleware
      authMiddleware(req, res, next);

      // Expect next to be called with no arguments
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next() when user has one of the required roles', () => {
      // Create authorize middleware with multiple roles
      const authMiddleware = authorize(['admin', 'user', 'manager']);

      // Call the middleware
      authMiddleware(req, res, next);

      // Expect next to be called with no arguments
      expect(next).toHaveBeenCalledWith();
    });

    it('should return 403 when user does not have the required role', () => {
      // Create authorize middleware with 'admin' role
      const authMiddleware = authorize('admin');

      // Call the middleware
      authMiddleware(req, res, next);

      // Expect next to be called with an AppError
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Insufficient permissions');
    });

    it('should return 401 when no user is attached to the request', () => {
      // Remove user from request
      req.user = null;

      // Create authorize middleware
      const authMiddleware = authorize('user');

      // Call the middleware
      authMiddleware(req, res, next);

      // Expect next to be called with an AppError
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });
  });
});
