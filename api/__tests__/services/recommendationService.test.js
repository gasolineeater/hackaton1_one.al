import recommendationService from '../../services/recommendationService.js';
import { Customer, Service, Subscription, Usage } from '../../models/index.js';
import cacheManager from '../../utils/cacheManager.js';
import aiService from '../../services/aiService.js';

// Mock dependencies
jest.mock('../../models/index.js', () => ({
  Customer: {
    findByPk: jest.fn(),
    findOne: jest.fn()
  },
  Service: {
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  Subscription: {
    findAll: jest.fn(),
    findOne: jest.fn()
  },
  Usage: {
    findAll: jest.fn()
  },
  Billing: {
    findAll: jest.fn()
  }
}));

jest.mock('../../utils/cacheManager.js', () => ({
  get: jest.fn(),
  set: jest.fn(),
  generateCacheKey: jest.fn()
}));

jest.mock('../../services/aiService.js', () => ({
  getServiceRecommendations: jest.fn(),
  getCostOptimizations: jest.fn(),
  getFutureTechRecommendations: jest.fn(),
  analyzeCustomerData: jest.fn()
}));

jest.mock('../../services/dataProcessingService.js');
jest.mock('../../services/mlService.js');
jest.mock('../../utils/logger.js');

describe('Recommendation Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getServiceRecommendations', () => {
    const customerId = 1;
    const options = {
      businessType: 'retail',
      employeeCount: 50,
      budget: 2000,
      useAI: false
    };

    const mockCustomer = {
      id: customerId,
      name: 'Test Company',
      businessType: 'retail',
      employeeCount: 50,
      industry: 'Retail'
    };

    const mockServices = [
      {
        id: 1,
        name: 'Business Internet',
        description: 'High-speed internet for businesses',
        type: 'internet',
        price: 49.99,
        features: ['100 Mbps', 'Static IP', '24/7 Support']
      },
      {
        id: 2,
        name: 'Business Phone',
        description: 'Phone service for businesses',
        type: 'phone',
        price: 29.99,
        features: ['Unlimited Calls', 'Voicemail', 'Call Forwarding']
      }
    ];

    const mockSubscriptions = [
      {
        id: 1,
        customerId: customerId,
        serviceId: 1,
        status: 'active',
        startDate: new Date('2023-01-01'),
        endDate: null,
        Service: mockServices[0]
      }
    ];

    it('should return service recommendations from database when available', async () => {
      // Setup mocks
      Customer.findByPk.mockResolvedValue(mockCustomer);
      Service.findAll.mockResolvedValue(mockServices);
      Subscription.findAll.mockResolvedValue(mockSubscriptions);
      cacheManager.get.mockReturnValue(null); // No cache hit

      // Call the service
      const result = await recommendationService.getServiceRecommendations(customerId, options);

      // Assertions
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.currentServices).toHaveLength(1);
      expect(result.data.recommendations).toBeDefined();
      expect(Customer.findByPk).toHaveBeenCalledWith(customerId);
      expect(Service.findAll).toHaveBeenCalled();
      expect(Subscription.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { customerId }
      }));
      expect(cacheManager.set).toHaveBeenCalled();
    });

    it('should return cached recommendations when available', async () => {
      // Setup mock for cache hit
      const cachedResult = {
        success: true,
        data: {
          currentServices: mockSubscriptions,
          recommendations: [
            {
              id: 2,
              name: 'Business Phone',
              description: 'Phone service for businesses',
              type: 'phone',
              price: 29.99,
              features: ['Unlimited Calls', 'Voicemail', 'Call Forwarding'],
              score: 0.85,
              reason: 'Complements your existing internet service'
            }
          ]
        }
      };
      cacheManager.get.mockReturnValue(cachedResult);

      // Call the service
      const result = await recommendationService.getServiceRecommendations(customerId, options);

      // Assertions
      expect(result).toEqual(cachedResult);
      expect(cacheManager.get).toHaveBeenCalled();
      expect(Customer.findByPk).not.toHaveBeenCalled();
      expect(Service.findAll).not.toHaveBeenCalled();
      expect(Subscription.findAll).not.toHaveBeenCalled();
    });

    it('should use AI service when useAI is true', async () => {
      // Setup mocks
      Customer.findByPk.mockResolvedValue(mockCustomer);
      Service.findAll.mockResolvedValue(mockServices);
      Subscription.findAll.mockResolvedValue(mockSubscriptions);
      cacheManager.get.mockReturnValue(null); // No cache hit
      
      const aiOptions = { ...options, useAI: true };
      const aiRecommendations = {
        success: true,
        data: {
          recommendedServices: [
            {
              id: 'ai-rec-1',
              name: 'AI-Recommended Service',
              description: 'AI-generated recommendation',
              monthlyCost: 39.99,
              benefits: ['Benefit 1', 'Benefit 2'],
              features: ['Feature 1', 'Feature 2'],
              whyRecommended: 'AI reasoning',
              fitScore: 95
            }
          ]
        },
        source: 'gemini'
      };
      aiService.getServiceRecommendations.mockResolvedValue(aiRecommendations);

      // Call the service
      const result = await recommendationService.getServiceRecommendations(customerId, aiOptions);

      // Assertions
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.currentServices).toHaveLength(1);
      expect(result.data.recommendations).toBeDefined();
      expect(result.data.aiRecommendations).toBeDefined();
      expect(aiService.getServiceRecommendations).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Setup mock to throw error
      Customer.findByPk.mockRejectedValue(new Error('Database error'));
      cacheManager.get.mockReturnValue(null); // No cache hit

      // Call the service
      const result = await recommendationService.getServiceRecommendations(customerId, options);

      // Assertions
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getUsagePatternAnalysis', () => {
    const customerId = 1;
    const options = {
      months: 3,
      serviceType: 'all',
      useAI: false
    };

    const mockUsageData = [
      {
        id: 1,
        customerId: customerId,
        subscriptionId: 1,
        date: new Date('2023-01-01'),
        dataUsage: 100,
        callMinutes: 200,
        smsCount: 50,
        serviceType: 'internet'
      },
      {
        id: 2,
        customerId: customerId,
        subscriptionId: 1,
        date: new Date('2023-01-02'),
        dataUsage: 120,
        callMinutes: 180,
        smsCount: 45,
        serviceType: 'internet'
      }
    ];

    it('should return usage pattern analysis', async () => {
      // Setup mocks
      Usage.findAll.mockResolvedValue(mockUsageData);
      cacheManager.get.mockReturnValue(null); // No cache hit

      // Call the service
      const result = await recommendationService.getUsagePatternAnalysis(customerId, options);

      // Assertions
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.usageFeatures).toBeDefined();
      expect(Usage.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { customerId }
      }));
      expect(cacheManager.set).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Setup mock to throw error
      Usage.findAll.mockRejectedValue(new Error('Database error'));
      cacheManager.get.mockReturnValue(null); // No cache hit

      // Call the service
      const result = await recommendationService.getUsagePatternAnalysis(customerId, options);

      // Assertions
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  // Add more tests for other methods as needed
});
