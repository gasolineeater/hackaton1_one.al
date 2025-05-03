import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import recommendationService from '../services/recommendationService.js';
import aiService from '../services/aiService.js';
import { validations, validate } from '../middleware/validationMiddleware.js';
import { AppError } from '../middleware/errorMiddleware.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /recommendations/services:
 *   get:
 *     summary: Get personalized service recommendations
 *     description: Returns service recommendations based on customer profile, usage patterns, and business needs
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *       - in: query
 *         name: businessType
 *         schema:
 *           type: string
 *           enum: [retail, healthcare, manufacturing, technology, finance, education, hospitality, other]
 *         description: Type of business
 *       - in: query
 *         name: employeeCount
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of employees
 *       - in: query
 *         name: budget
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Monthly budget in EUR
 *       - in: query
 *         name: useAI
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Whether to use AI for enhanced recommendations
 *     responses:
 *       200:
 *         description: Successful response with recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentServices:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           type:
 *                             type: string
 *                           price:
 *                             type: number
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           type:
 *                             type: string
 *                           price:
 *                             type: number
 *                           score:
 *                             type: number
 *                           reason:
 *                             type: string
 *                     aiRecommendations:
 *                       type: object
 *                       description: AI-enhanced recommendations (only when useAI=true)
 *       400:
 *         description: Bad request
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */
router.get('/services', authenticate, async (req, res, next) => {
  try {
    const {
      customerId,
      businessType = 'general',
      employeeCount = 50,
      budget,
      currentServices,
      priority = 'balanced',
      useAI = false
    } = req.query;

    // If customerId is provided, use the ML-based recommendation service
    if (customerId && useAI !== 'gemini-only') {
      // Get recommendations from ML service
      const result = await recommendationService.getServiceRecommendations(customerId, {
        businessType,
        employeeCount: employeeCount ? parseInt(employeeCount) : undefined,
        budget: budget ? parseFloat(budget) : undefined,
        useAI: useAI === 'true'
      });

      if (!result.success) {
        return next(new AppError(result.error, 400));
      }

      return res.json({
        status: 'success',
        data: result.data
      });
    }

    // Fallback to AI service for recommendations
    const result = await aiService.getServiceRecommendations({
      businessType,
      employeeCount: parseInt(employeeCount),
      budget: budget ? parseFloat(budget) : undefined,
      currentServices,
      priority
    });

    if (!result.success) {
      return next(new AppError(result.error, 500));
    }

    res.json({
      status: 'success',
      data: result.data,
      source: result.source
    });
  } catch (error) {
    logger.error('Service recommendations error:', { error: error.message, stack: error.stack });
    next(error);
  }
});

/**
 * @route GET /api/recommendations/optimization
 * @desc Get cost optimization recommendations
 * @access Private
 */
router.get('/optimization', authenticate, async (req, res, next) => {
  try {
    const {
      customerId,
      usageData,
      currentServices,
      optimizationGoal = 'cost',
      threshold,
      useAI = false
    } = req.query;

    // If customerId is provided, use the ML-based optimization service
    if (customerId && useAI !== 'gemini-only') {
      // Get recommendations from ML service
      const result = await recommendationService.getCostOptimizationRecommendations(customerId, {
        optimizationGoal,
        threshold: threshold ? parseInt(threshold) : 50,
        useAI: useAI === 'true'
      });

      if (!result.success) {
        return next(new AppError(result.error, 400));
      }

      return res.json({
        status: 'success',
        data: result.data
      });
    }

    // Fallback to AI service for optimization recommendations
    const result = await aiService.getCostOptimizations({
      usageData,
      currentServices,
      optimizationGoal
    });

    if (!result.success) {
      return next(new AppError(result.error, 500));
    }

    res.json({
      status: 'success',
      data: result.data,
      source: result.source
    });
  } catch (error) {
    logger.error('Optimization recommendations error:', { error: error.message, stack: error.stack });
    next(error);
  }
});

/**
 * @swagger
 * /recommendations/patterns:
 *   get:
 *     summary: Get usage pattern analysis
 *     description: Analyzes customer usage patterns to identify trends, anomalies, and optimization opportunities
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *       - in: query
 *         name: period
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           default: 3
 *         description: Analysis period in months
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *           enum: [all, internet, voice, mobile, cloud, iot]
 *           default: all
 *         description: Type of service to analyze
 *       - in: query
 *         name: useAI
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Whether to use AI for enhanced analysis
 *     responses:
 *       200:
 *         description: Successful response with usage pattern analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     usageFeatures:
 *                       type: object
 *                       properties:
 *                         dataUsage:
 *                           type: object
 *                         callMinutes:
 *                           type: object
 *                         smsCount:
 *                           type: object
 *                     anomalies:
 *                       type: object
 *                       properties:
 *                         anomalies:
 *                           type: array
 *                     predictions:
 *                       type: object
 *                       properties:
 *                         predictions:
 *                           type: array
 *                     aiInsights:
 *                       type: object
 *                       description: AI-enhanced insights (only when useAI=true)
 *       400:
 *         description: Bad request
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */
router.get('/patterns', authenticate, async (req, res, next) => {
  try {
    const { customerId, period, serviceType, useAI } = req.query;

    // Validate customerId
    if (!customerId) {
      return next(new AppError('Customer ID is required', 400));
    }

    // Get usage pattern analysis
    const result = await recommendationService.getUsagePatternAnalysis(customerId, {
      months: period ? parseInt(period) : 3,
      serviceType: serviceType || 'all',
      useAI: useAI === 'true'
    });

    if (!result.success) {
      return next(new AppError(result.error, 400));
    }

    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    logger.error('Error getting usage pattern analysis:', { error: error.message, stack: error.stack });
    next(error);
  }
});

/**
 * @route GET /api/recommendations/forecast
 * @desc Get future service needs predictions
 * @access Private
 */
router.get('/forecast', authenticate, async (req, res, next) => {
  try {
    const { customerId, timeframe, confidenceLevel, serviceType, useAI } = req.query;

    // Validate customerId
    if (!customerId) {
      return next(new AppError('Customer ID is required', 400));
    }

    // Get future usage prediction
    const result = await recommendationService.getUsagePatternAnalysis(customerId, {
      months: timeframe ? parseInt(timeframe) : 3,
      serviceType: serviceType || 'all',
      confidenceLevel: confidenceLevel || 'medium',
      useAI: useAI === 'true'
    });

    if (!result.success) {
      return next(new AppError(result.error, 400));
    }

    // Extract prediction data
    const { predictions } = result.data;

    res.json({
      status: 'success',
      data: {
        predictions,
        forecastPeriod: timeframe ? parseInt(timeframe) : 3,
        confidenceLevel: confidenceLevel || 'medium'
      }
    });
  } catch (error) {
    logger.error('Error getting future service needs predictions:', { error: error.message, stack: error.stack });
    next(error);
  }
});

/**
 * @route GET /api/recommendations/future
 * @desc Get future technology recommendations
 * @access Private
 */
router.get('/future', authenticate, async (req, res, next) => {
  try {
    const {
      industryType = 'general',
      timeframe = 'short',
      currentTech
    } = req.query;

    const result = await aiService.getFutureTechRecommendations({
      industryType,
      timeframe,
      currentTech
    });

    if (!result.success) {
      return next(new AppError(result.error, 500));
    }

    res.json({
      status: 'success',
      data: result.data,
      source: result.source
    });
  } catch (error) {
    logger.error('Future tech recommendations error:', { error: error.message, stack: error.stack });
    next(error);
  }
});

/**
 * @route GET /api/recommendations/bundles
 * @desc Get recommended service bundles
 * @access Private
 */
router.get('/bundles', authenticate, async (req, res, next) => {
  try {
    const { customerId, budget, priorities, useAI } = req.query;

    // Validate customerId
    if (!customerId) {
      return next(new AppError('Customer ID is required', 400));
    }

    // Get service recommendations with focus on bundles
    const result = await recommendationService.getServiceRecommendations(customerId, {
      budget: budget ? parseFloat(budget) : undefined,
      priorities: priorities ? priorities.split(',') : undefined,
      focusOnBundles: true,
      useAI: useAI === 'true'
    });

    if (!result.success) {
      return next(new AppError(result.error, 400));
    }

    // Extract bundle recommendations
    const bundleRecommendations = result.data.recommendations.bundleOpportunities || [];

    res.json({
      status: 'success',
      data: {
        bundles: bundleRecommendations,
        currentServices: result.data.currentServices
      }
    });
  } catch (error) {
    logger.error('Error getting recommended service bundles:', { error: error.message, stack: error.stack });
    next(error);
  }
});

/**
 * @route GET /api/recommendations/segments
 * @desc Get customer segmentation
 * @access Private (Admin only)
 */
router.get('/segments', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    // Get customer segmentation
    const result = await recommendationService.getCustomerSegmentation();

    if (!result.success) {
      return next(new AppError(result.error, 400));
    }

    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    logger.error('Error getting customer segmentation:', { error: error.message, stack: error.stack });
    next(error);
  }
});

export default router;
