/**
 * Telecom API Tests
 */

const { createTestUserAndToken, cleanupTestData, authenticatedRequest, closeDbConnection } = require('./setup');

// Test data
let testUser;
let token;
let testLine;

// Setup before tests
beforeAll(async () => {
  // Create test user and get token
  const result = await createTestUserAndToken();
  testUser = result.user;
  token = result.token;
});

// Clean up after tests
afterAll(async () => {
  if (testUser) {
    await cleanupTestData(testUser.id);
  }
  await closeDbConnection();
});

describe('Telecom API', () => {
  describe('GET /api/telecom/plans', () => {
    it('should get all service plans', async () => {
      const res = await authenticatedRequest(token)
        .get('/api/telecom/plans');
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      
      // Check plan structure
      const plan = res.body[0];
      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('data_limit');
      expect(plan).toHaveProperty('calls');
      expect(plan).toHaveProperty('sms');
      expect(plan).toHaveProperty('price');
      expect(plan).toHaveProperty('features');
    });
  });
  
  describe('GET /api/telecom/plans/:id', () => {
    let planId;
    
    beforeAll(async () => {
      // Get a plan ID for testing
      const res = await authenticatedRequest(token)
        .get('/api/telecom/plans');
      
      planId = res.body[0].id;
    });
    
    it('should get a service plan by ID', async () => {
      const res = await authenticatedRequest(token)
        .get(`/api/telecom/plans/${planId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', planId);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('data_limit');
      expect(res.body).toHaveProperty('features');
    });
    
    it('should return 404 if plan not found', async () => {
      const res = await authenticatedRequest(token)
        .get('/api/telecom/plans/9999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('not found');
    });
  });
  
  describe('Telecom Lines CRUD', () => {
    let planId;
    
    beforeAll(async () => {
      // Get a plan ID for testing
      const res = await authenticatedRequest(token)
        .get('/api/telecom/plans');
      
      planId = res.body[0].id;
    });
    
    it('should create a new telecom line', async () => {
      const newLine = {
        phone_number: '+355691234567',
        assigned_to: 'Test User',
        plan_id: planId,
        monthly_limit: 10,
        current_usage: 0,
        status: 'active'
      };
      
      const res = await authenticatedRequest(token)
        .post('/api/telecom/lines')
        .send(newLine);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('phone_number', newLine.phone_number);
      expect(res.body).toHaveProperty('assigned_to', newLine.assigned_to);
      expect(res.body).toHaveProperty('plan_id', planId);
      
      // Save line for later tests
      testLine = res.body;
    });
    
    it('should get all telecom lines', async () => {
      const res = await authenticatedRequest(token)
        .get('/api/telecom/lines');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('lines');
      expect(Array.isArray(res.body.lines)).toBeTruthy();
      expect(res.body.lines.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('totalCount');
    });
    
    it('should get a telecom line by ID', async () => {
      const res = await authenticatedRequest(token)
        .get(`/api/telecom/lines/${testLine.id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', testLine.id);
      expect(res.body).toHaveProperty('phone_number', testLine.phone_number);
      expect(res.body).toHaveProperty('assigned_to', testLine.assigned_to);
    });
    
    it('should update a telecom line', async () => {
      const updatedData = {
        assigned_to: 'Updated User',
        monthly_limit: 15
      };
      
      const res = await authenticatedRequest(token)
        .put(`/api/telecom/lines/${testLine.id}`)
        .send(updatedData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', testLine.id);
      expect(res.body).toHaveProperty('assigned_to', updatedData.assigned_to);
      expect(res.body).toHaveProperty('monthly_limit', updatedData.monthly_limit);
      expect(res.body).toHaveProperty('phone_number', testLine.phone_number); // Unchanged
    });
    
    it('should delete a telecom line', async () => {
      const res = await authenticatedRequest(token)
        .delete(`/api/telecom/lines/${testLine.id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('deleted successfully');
      
      // Verify line is deleted
      const getRes = await authenticatedRequest(token)
        .get(`/api/telecom/lines/${testLine.id}`);
      
      expect(getRes.statusCode).toEqual(404);
    });
  });
});
