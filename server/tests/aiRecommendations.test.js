/**
 * AI Recommendations API Tests
 */

const { createTestUserAndToken, cleanupTestData, authenticatedRequest, closeDbConnection } = require('./setup');

// Test data
let testUser;
let token;
let testRecommendation;

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

describe('AI Recommendations API', () => {
  describe('POST /api/ai-recommendations/generate', () => {
    it('should generate recommendations', async () => {
      const res = await authenticatedRequest(token)
        .post('/api/ai-recommendations/generate');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.recommendations)).toBeTruthy();
    });
  });
  
  describe('GET /api/ai-recommendations', () => {
    beforeAll(async () => {
      // Generate recommendations if none exist
      await authenticatedRequest(token)
        .post('/api/ai-recommendations/generate');
    });
    
    it('should get all recommendations', async () => {
      const res = await authenticatedRequest(token)
        .get('/api/ai-recommendations');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.recommendations)).toBeTruthy();
      expect(res.body).toHaveProperty('totalCount');
      
      if (res.body.recommendations.length > 0) {
        testRecommendation = res.body.recommendations[0];
      }
    });
    
    it('should filter recommendations by priority', async () => {
      const res = await authenticatedRequest(token)
        .get('/api/ai-recommendations?priority=high');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('recommendations');
      
      // All recommendations should have high priority
      res.body.recommendations.forEach(rec => {
        expect(rec.priority).toEqual('high');
      });
    });
    
    it('should filter recommendations by applied status', async () => {
      const res = await authenticatedRequest(token)
        .get('/api/ai-recommendations?applied=false');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('recommendations');
      
      // All recommendations should not be applied
      res.body.recommendations.forEach(rec => {
        expect(rec.is_applied).toEqual(0);
      });
    });
  });
  
  describe('GET /api/ai-recommendations/:id', () => {
    it('should get a recommendation by ID', async () => {
      // Skip if no recommendation exists
      if (!testRecommendation) {
        return;
      }
      
      const res = await authenticatedRequest(token)
        .get(`/api/ai-recommendations/${testRecommendation.id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', testRecommendation.id);
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('description');
      expect(res.body).toHaveProperty('savings_amount');
    });
    
    it('should return 404 if recommendation not found', async () => {
      const res = await authenticatedRequest(token)
        .get('/api/ai-recommendations/9999');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('not found');
    });
  });
  
  describe('PUT /api/ai-recommendations/:id/apply', () => {
    it('should apply a recommendation', async () => {
      // Skip if no recommendation exists
      if (!testRecommendation) {
        return;
      }
      
      const res = await authenticatedRequest(token)
        .put(`/api/ai-recommendations/${testRecommendation.id}/apply`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', testRecommendation.id);
      expect(res.body).toHaveProperty('is_applied', 1);
    });
  });
  
  describe('DELETE /api/ai-recommendations/:id', () => {
    it('should dismiss a recommendation', async () => {
      // Skip if no recommendation exists
      if (!testRecommendation) {
        return;
      }
      
      const res = await authenticatedRequest(token)
        .delete(`/api/ai-recommendations/${testRecommendation.id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('dismissed successfully');
      
      // Verify recommendation is deleted
      const getRes = await authenticatedRequest(token)
        .get(`/api/ai-recommendations/${testRecommendation.id}`);
      
      expect(getRes.statusCode).toEqual(404);
    });
  });
});
