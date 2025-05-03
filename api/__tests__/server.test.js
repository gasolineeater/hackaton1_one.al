import request from 'supertest';
import app from '../server.js';

// Mock dependencies
jest.mock('../utils/logger.js');
jest.mock('../config/database.js', () => ({
  testConnection: jest.fn().mockResolvedValue(true),
  closeConnection: jest.fn().mockResolvedValue(true)
}));
jest.mock('../models/index.js', () => ({
  syncDatabase: jest.fn().mockResolvedValue(true)
}));
jest.mock('../config/validateEnv.js', () => ({
  validateEnv: jest.fn().mockReturnValue(true)
}));

describe('Server', () => {
  describe('Health Check', () => {
    it('should return 200 OK for health check endpoint', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message', 'API is running');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });
  
  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent-route');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Not Found');
    });
  });
  
  describe('Error Handler', () => {
    it('should handle errors properly', async () => {
      // Create a route that throws an error for testing
      app.get('/api/test-error', () => {
        throw new Error('Test error');
      });
      
      const response = await request(app).get('/api/test-error');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message');
    });
  });
});
