import express from 'express';
import { generateResponse, parseGeminiResponse } from '../utils/geminiClient.js';
import analyticsService from '../services/analyticsService.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/analytics/usage
 * @desc Get usage analytics
 * @access Private
 */
router.get('/usage', authenticate, async (req, res) => {
  try {
    const {
      customerId,
      period = 'monthly',
      serviceType = 'all',
      startDate,
      endDate,
      groupBy = 'service',
      useAI = false
    } = req.query;

    // Check if user has access to this customer
    if (customerId && req.user.role !== 'admin' && req.user.customerId !== parseInt(customerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this customer\'s data'
      });
    }

    // Use customer ID from user if not specified and not admin
    const effectiveCustomerId = customerId || (req.user.role !== 'admin' ? req.user.customerId : null);

    // If AI-generated data is requested
    if (useAI === 'true') {
      const prompt = `
        You are an API for a telecom company called ONE Albania.
        Generate realistic usage analytics for a business's telecom services.
        Period: ${period} (daily, weekly, monthly, quarterly, yearly)
        Service type: ${serviceType} (all, mobile, internet, fixed, cloud, etc.)

        Format the response as a JSON object with the following properties:
        - period: the analyzed period
        - serviceType: the type of service analyzed
        - totalUsage: object with usage metrics appropriate for the service type
        - usageByDepartment: breakdown of usage by department
        - usageByEmployee: top 5 employees by usage
        - peakUsageTimes: when usage is highest
        - unusualPatterns: any detected unusual usage patterns
        - usageTrend: array of data points showing usage trend
        - benchmarks: how usage compares to similar businesses

        For mobile services, include voice minutes, data, SMS.
        For internet services, include bandwidth usage, peak times.
        For cloud services, include storage, compute hours, API calls.

        Make the data realistic for an Albanian business context.
        Return ONLY the JSON without any additional text.
      `;

      const response = await generateResponse(prompt);
      const usageAnalytics = parseGeminiResponse(response.text, 'json');

      return res.json({
        status: 'success',
        source: 'ai',
        data: usageAnalytics
      });
    }

    // Get usage analytics from database
    const result = await analyticsService.getUsageAnalytics({
      customerId: effectiveCustomerId,
      period,
      serviceType,
      startDate,
      endDate,
      groupBy
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      source: 'database',
      data: result.data
    });
  } catch (error) {
    console.error('Usage analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve usage analytics',
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/performance
 * @desc Get performance analytics for services
 * @access Private
 */
router.get('/performance', authenticate, async (req, res) => {
  try {
    const {
      customerId,
      serviceIds,
      period = 'monthly',
      startDate,
      endDate,
      useAI = false
    } = req.query;

    // Check if user has access to this customer
    if (customerId && req.user.role !== 'admin' && req.user.customerId !== parseInt(customerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this customer\'s data'
      });
    }

    // Use customer ID from user if not specified and not admin
    const effectiveCustomerId = customerId || (req.user.role !== 'admin' ? req.user.customerId : null);

    // If AI-generated data is requested
    if (useAI === 'true') {
      const prompt = `
        You are an API for a telecom company called ONE Albania.
        Generate realistic performance analytics for telecom services.
        ${serviceIds ? `Focus on services with IDs: ${serviceIds}` : 'Include all service types.'}

        Format the response as a JSON object with the following properties:
        - overallPerformanceScore: score out of 100
        - servicePerformance: array of services with:
          - id: service identifier
          - name: service name
          - type: service type
          - performanceScore: score out of 100
          - reliability: percentage uptime
          - speedMetrics: relevant speed measurements
          - qualityMetrics: quality measurements
          - issues: array of detected issues
          - recommendations: recommendations to improve performance
        - comparativeAnalysis: how performance compares to industry standards
        - historicalTrend: performance trend over last 6 months

        Make the data realistic for Albanian telecom services.
        Return ONLY the JSON without any additional text.
      `;

      const response = await generateResponse(prompt);
      const performanceAnalytics = parseGeminiResponse(response.text, 'json');

      return res.json({
        status: 'success',
        source: 'ai',
        data: performanceAnalytics
      });
    }

    // Get performance analytics from database
    const result = await analyticsService.getPerformanceAnalytics({
      customerId: effectiveCustomerId,
      serviceIds,
      period,
      startDate,
      endDate
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      source: 'database',
      data: result.data
    });
  } catch (error) {
    console.error('Performance analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve performance analytics',
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/cost
 * @desc Get cost analytics data
 * @access Private
 */
router.get('/cost', authenticate, async (req, res) => {
  try {
    const {
      customerId,
      period = 'monthly',
      serviceType = 'all',
      startDate,
      endDate,
      groupBy = 'service',
      useAI = false
    } = req.query;

    // Check if user has access to this customer
    if (customerId && req.user.role !== 'admin' && req.user.customerId !== parseInt(customerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this customer\'s data'
      });
    }

    // Use customer ID from user if not specified and not admin
    const effectiveCustomerId = customerId || (req.user.role !== 'admin' ? req.user.customerId : null);

    // If AI-generated data is requested
    if (useAI === 'true') {
      const prompt = `
        You are an API for a telecom company called ONE Albania.
        Generate realistic cost analytics for telecom services.
        Period: ${period}
        Service type: ${serviceType}

        Format the response as a JSON object with the following properties:
        - period: the analyzed period
        - serviceType: the type of service analyzed
        - totalCost: total cost for the period
        - costBreakdown: breakdown by service type
        - costTrend: trend over time
        - costDrivers: main factors driving costs
        - savingsOpportunities: potential areas for cost reduction

        Make the data realistic for Albanian telecom services.
        Return ONLY the JSON without any additional text.
      `;

      const response = await generateResponse(prompt);
      const costAnalytics = parseGeminiResponse(response.text, 'json');

      return res.json({
        status: 'success',
        source: 'ai',
        data: costAnalytics
      });
    }

    // Get cost analytics from database
    const result = await analyticsService.getCostAnalytics({
      customerId: effectiveCustomerId,
      period,
      serviceType,
      startDate,
      endDate,
      groupBy
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      source: 'database',
      data: result.data
    });
  } catch (error) {
    console.error('Cost analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve cost analytics',
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/optimization
 * @desc Get cost optimization recommendations
 * @access Private
 */
router.get('/optimization', authenticate, async (req, res) => {
  try {
    const {
      customerId,
      threshold = 50,
      useAI = false
    } = req.query;

    // Check if user has access to this customer
    if (customerId && req.user.role !== 'admin' && req.user.customerId !== parseInt(customerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this customer\'s data'
      });
    }

    // Use customer ID from user if not specified and not admin
    const effectiveCustomerId = customerId || (req.user.role !== 'admin' ? req.user.customerId : null);

    // If AI-generated data is requested
    if (useAI === 'true') {
      const prompt = `
        You are an API for a telecom company called ONE Albania.
        Generate realistic cost optimization recommendations for telecom services.

        Format the response as a JSON object with the following properties:
        - totalPotentialSavings: total amount that could be saved
        - recommendationCount: number of recommendations
        - recommendations: array of recommendation objects with:
          - type: type of recommendation (e.g., "downgrade", "consolidate", "eliminate")
          - description: detailed description of the recommendation
          - currentCost: current monthly cost
          - projectedCost: projected cost after implementing recommendation
          - savings: monthly savings amount
          - implementationDifficulty: difficulty level (easy, medium, hard)
          - impact: impact on service quality (none, low, medium, high)

        Make the recommendations realistic for Albanian telecom services.
        Return ONLY the JSON without any additional text.
      `;

      const response = await generateResponse(prompt);
      const optimizationRecommendations = parseGeminiResponse(response.text, 'json');

      return res.json({
        status: 'success',
        source: 'ai',
        data: optimizationRecommendations
      });
    }

    // Get optimization recommendations from database
    const result = await analyticsService.getCostOptimization({
      customerId: effectiveCustomerId,
      threshold: parseInt(threshold)
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      source: 'database',
      data: result.data
    });
  } catch (error) {
    console.error('Cost optimization error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve cost optimization recommendations',
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/dashboard
 * @desc Get dashboard summary data
 * @access Private
 */
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const { customerId, useAI = false } = req.query;

    // Check if user has access to this customer
    if (customerId && req.user.role !== 'admin' && req.user.customerId !== parseInt(customerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this customer\'s data'
      });
    }

    // Use customer ID from user if not specified and not admin
    const effectiveCustomerId = customerId || (req.user.role !== 'admin' ? req.user.customerId : null);

    // If AI-generated data is requested
    if (useAI === 'true') {
      const prompt = `
        You are an API for a telecom company called ONE Albania.
        Generate realistic dashboard summary data for telecom services.

        Format the response as a JSON object with the following properties:
        - customerCount: number of customers
        - activeSubscriptionCount: number of active subscriptions
        - totalMonthlyCost: total monthly cost
        - potentialSavings: potential monthly savings
        - serviceDistribution: distribution of services by type
        - monthlyCostTrend: cost trend over last 6 months
        - keyMetrics: array of important metrics with current values and trends

        Make the data realistic for Albanian telecom services.
        Return ONLY the JSON without any additional text.
      `;

      const response = await generateResponse(prompt);
      const dashboardData = parseGeminiResponse(response.text, 'json');

      return res.json({
        status: 'success',
        source: 'ai',
        data: dashboardData
      });
    }

    // Get dashboard summary from database
    const result = await analyticsService.getDashboardSummary({
      customerId: effectiveCustomerId
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      source: 'database',
      data: result.data
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve dashboard summary',
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/roi
 * @desc Get ROI analysis for telecom services
 * @access Private
 */
router.get('/roi', authenticate, async (req, res) => {
  try {
    const { serviceId, timeframe = '12months' } = req.query;

    if (!serviceId) {
      return res.status(400).json({
        status: 'error',
        message: 'Service ID is required for ROI analysis'
      });
    }

    const prompt = `
      You are an API for a telecom company called ONE Albania.
      Generate a realistic Return on Investment (ROI) analysis for a telecom service with ID ${serviceId}.
      Timeframe for analysis: ${timeframe}

      Format the response as a JSON object with the following properties:
      - serviceId: "${serviceId}"
      - serviceName: name of the service
      - timeframe: "${timeframe}"
      - initialInvestment: initial cost in EUR
      - ongoingCosts: monthly costs in EUR
      - directBenefits: quantifiable benefits in EUR
      - indirectBenefits: non-quantifiable benefits
      - roi: calculated ROI as a percentage
      - paybackPeriod: time to recoup investment in months
      - comparisonToAlternatives: how ROI compares to alternatives
      - sensitivityAnalysis: how ROI changes with different variables
      - recommendations: recommendations based on ROI analysis

      Make the analysis realistic for an Albanian business context.
      Return ONLY the JSON without any additional text.
    `;

    const response = await generateResponse(prompt);
    const roiAnalysis = parseGeminiResponse(response.text, 'json');

    res.json({
      status: 'success',
      source: 'ai',
      data: roiAnalysis
    });
  } catch (error) {
    console.error('ROI analysis error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate ROI analysis',
      error: error.message
    });
  }
});

export default router;
