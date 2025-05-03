/**
 * Authentication API Tests
 */

const request = require('supertest');
const app = require('../server');
const { createTestUserAndToken, cleanupTestData, closeDbConnection } = require('./setup');

// Test user data
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'Test@123',
  role: 'user',
  company_name: 'Test Company'
};

// Store user ID for cleanup
let testUserId;

// Close database connection after all tests
afterAll(async () => {
  if (testUserId) {
    await cleanupTestData(testUserId);
  }
  await closeDbConnection();
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('id');
      expect(res.body.username).toEqual(testUser.username);
      expect(res.body.email).toEqual(testUser.email);
      
      // Store user ID for cleanup
      testUserId = res.body.id;
    });
    
    it('should return 400 if email is already in use', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Email is already in use');
    });
    
    it('should return 400 if username is already taken', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: `test_${Date.now()}@example.com` // Different email
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Username is already taken');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('id');
      expect(res.body.username).toEqual(testUser.username);
      expect(res.body.email).toEqual(testUser.email);
    });
    
    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test@123'
        });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('User not found');
    });
    
    it('should return 401 if password is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Invalid password');
    });
  });
  
  describe('GET /api/auth/profile', () => {
    let token;
    
    beforeAll(async () => {
      // Login to get token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      token = res.body.accessToken;
    });
    
    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.username).toEqual(testUser.username);
      expect(res.body.email).toEqual(testUser.email);
      expect(res.body).not.toHaveProperty('password'); // Password should not be returned
    });
    
    it('should return 403 if no token provided', async () => {
      const res = await request(app)
        .get('/api/auth/profile');
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('No token provided');
    });
    
    it('should return 401 if token is invalid', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid_token');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('Unauthorized');
    });
  });
});
