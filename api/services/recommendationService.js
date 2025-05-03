import { Op } from 'sequelize';
import { Customer, Service, Subscription, Usage, Billing } from '../models/index.js';
import dataProcessingService from './dataProcessingService.js';
import mlService from './mlService.js';
import logger from '../utils/logger.js';
import cacheManager from '../utils/cacheManager.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cache TTL values (in seconds)
const CACHE_TTL = {
  SERVICE_RECOMMENDATIONS: 3600, // 1 hour
  USAGE_PATTERNS: 1800,          // 30 minutes
  COST_OPTIMIZATION: 3600,       // 1 hour
  CUSTOMER_SEGMENTATION: 86400   // 24 hours
};

/**
 * Service for generating recommendations
 * Combines ML models and business rules to provide service recommendations
 */
class RecommendationService {
  /**
   * Generate cache key for a request
   * @param {string} prefix - Cache key prefix
   * @param {number} customerId - Customer ID
   * @param {Object} options - Request options
   * @returns {string} Cache key
   */
  generateCacheKey(prefix, customerId, options = {}) {
    // Create a deterministic string representation of options
    const optionsStr = JSON.stringify(options, Object.keys(options).sort());

    // Create a hash of the options to keep the key length reasonable
    const optionsHash = crypto
      .createHash('md5')
      .update(optionsStr)
      .digest('hex')
      .substring(0, 8);

    return `${prefix}:${customerId}:${optionsHash}`;
  }

  /**
   * Get service recommendations for a customer
   * @param {number} customerId - Customer ID
   * @param {Object} options - Options for recommendations
   * @returns {Promise<Object>} Recommendations
   */
  async getServiceRecommendations(customerId, options = {}) {
    try {
      const { useAI = false } = options;

      // Check cache first
      const cacheKey = this.generateCacheKey('recommendations', customerId, options);
      const cachedResult = cacheManager.get(cacheKey);

      if (cachedResult) {
        logger.debug(`Cache hit for service recommendations: ${cacheKey}`);
        return cachedResult;
      }

      logger.debug(`Cache miss for service recommendations: ${cacheKey}`);

      // Get customer data
      const customer = await Customer.findByPk(customerId, {
        include: [{
          model: Subscription,
          include: [Service]
        }]
      });

      if (!customer) {
        return {
          success: false,
          error: 'Customer not found'
        };
      }

      // Get current subscriptions
      const currentServices = customer.Subscriptions.map(sub => ({
        id: sub.Service.id,
        name: sub.Service.name,
        type: sub.Service.type,
        price: sub.Service.price,
        features: sub.Service.features
      }));

      // Get service types the customer already has
      const existingServiceTypes = new Set(currentServices.map(service => service.type));

      let recommendations;

      if (useAI) {
        // Use Gemini API for AI-powered recommendations
        recommendations = await this.getAIRecommendations(customer, currentServices, existingServiceTypes);
      } else {
        // Use collaborative filtering for recommendations
        const collaborativeResult = await mlService.collaborativeFiltering(customerId);

        if (!collaborativeResult.success) {
          return collaborativeResult;
        }

        // Get usage-based recommendations
        const usageResult = await this.getUsageBasedRecommendations(customerId);

        if (!usageResult.success) {
          return usageResult;
        }

        // Combine recommendations
        recommendations = {
          collaborativeFiltering: collaborativeResult.data.recommendedServices || [],
          usageBased: usageResult.data.recommendations || []
        };
      }

      // Prepare result
      const result = {
        success: true,
        data: {
          currentServices,
          recommendations
        }
      };

      // Cache the result
      cacheManager.set(cacheKey, result, CACHE_TTL.SERVICE_RECOMMENDATIONS);

      return result;
    } catch (error) {
      logger.error('Error getting service recommendations:', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get AI-powered recommendations using Gemini API
   * @param {Object} customer - Customer object
   * @param {Array} currentServices - Current services
   * @param {Set} existingServiceTypes - Existing service types
   * @returns {Promise<Object>} AI recommendations
   */
  async getAIRecommendations(customer, currentServices, existingServiceTypes) {
    try {
      // Create a prompt for Gemini API
      const prompt = \`
You are an AI recommendation system for ONE Albania, a telecom provider.
Generate personalized service recommendations for the following customer:

Customer Information:
- Company Name: ${customer.companyName}
- Business Type: ${customer.businessType}
- Employee Count: ${customer.employeeCount}
- Current Services: ${JSON.stringify(currentServices, null, 2)}

Based on this information, provide the following recommendations:
1. Service Upgrades: Recommend upgrades to existing services
2. New Services: Recommend new services that would benefit this customer
3. Cost Optimization: Suggest ways to optimize costs
4. Bundle Opportunities: Identify potential service bundles

For each recommendation, provide:
- Service name
- Service type
- Brief description of benefits
- Estimated monthly cost
- Priority (high, medium, low)

Format your response as a JSON object with the following structure:
{
  "serviceUpgrades": [
    {
      "name": "Service name",
      "type": "Service type",
      "description": "Brief description",
      "monthlyCost": 0,
      "priority": "high/medium/low"
    }
  ],
  "newServices": [...],
  "costOptimization": [...],
  "bundleOpportunities": [...]
}
\`;

      // Generate recommendations using Gemini API
      const modelName = process.env.GEMINI_MODEL || "gemini-pro";
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\\{[\\s\\S]*\\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }

      const recommendations = JSON.parse(jsonMatch[0]);

      return recommendations;
    } catch (error) {
      logger.error('Error getting AI recommendations:', { error: error.message });

      // Return fallback recommendations
      return {
        serviceUpgrades: [],
        newServices: [],
        costOptimization: [],
        bundleOpportunities: []
      };
    }
  }

  /**
   * Get usage-based recommendations
   * @param {number} customerId - Customer ID
   * @returns {Promise<Object>} Usage-based recommendations
   */
  async getUsageBasedRecommendations(customerId) {
    try {
      // Get usage features
      const usageResult = await dataProcessingService.extractUsageFeatures(customerId);

      if (!usageResult.success) {
        return usageResult;
      }

      const usageFeatures = usageResult.data;

      // Get customer features
      const customerResult = await dataProcessingService.extractCustomerFeatures(customerId);

      if (!customerResult.success) {
        return customerResult;
      }

      const customerFeatures = customerResult.data;

      // Get billing features
      const billingResult = await dataProcessingService.extractBillingFeatures(customerId);

      if (!billingResult.success) {
        return billingResult;
      }

      const billingFeatures = billingResult.data;

      // Generate recommendations based on usage patterns
      const recommendations = [];

      // Check for high data usage
      if (usageFeatures.maxDataUsage > 0.8 * usageFeatures.totalDataUsage) {
        recommendations.push({
          type: 'data_plan_upgrade',
          name: 'Data Plan Upgrade',
          description: 'Your data usage is approaching your limit. Consider upgrading to a higher data plan.',
          confidence: 0.85,
          priority: 'high'
        });
      }

      // Check for low data usage
      if (usageFeatures.maxDataUsage < 0.3 * usageFeatures.totalDataUsage && billingFeatures.totalBilled > 0) {
        recommendations.push({
          type: 'data_plan_downgrade',
          name: 'Data Plan Optimization',
          description: 'Your data usage is consistently low. You could save by switching to a lower data plan.',
          confidence: 0.75,
          priority: 'medium'
        });
      }

      // Check for usage growth trend
      if (usageFeatures.usageGrowthRate > 0.1) {
        recommendations.push({
          type: 'capacity_planning',
          name: 'Capacity Planning',
          description: 'Your usage is growing steadily. Plan for increased capacity in the coming months.',
          confidence: 0.7,
          priority: 'medium'
        });
      }

      // Check for business type specific recommendations
      if (customerFeatures.businessType === 'retail' && !customerFeatures.serviceTypes['iot']) {
        recommendations.push({
          type: 'iot_services',
          name: 'IoT Services for Retail',
          description: 'IoT services can help retail businesses with inventory tracking and customer analytics.',
          confidence: 0.65,
          priority: 'medium'
        });
      }

      if (customerFeatures.businessType === 'healthcare' && !customerFeatures.serviceTypes['cloud']) {
        recommendations.push({
          type: 'cloud_services',
          name: 'Cloud Services for Healthcare',
          description: 'Secure cloud services for healthcare data storage and compliance.',
          confidence: 0.8,
          priority: 'high'
        });
      }

      // Check for employee count vs. service ratio
      if (customerFeatures.employeeCount > 20 && customerFeatures.subscriptionCount < 5) {
        recommendations.push({
          type: 'service_expansion',
          name: 'Service Expansion',
          description: 'Your employee to service ratio suggests you might benefit from additional services.',
          confidence: 0.6,
          priority: 'low'
        });
      }

      // Check for peak usage times
      if (usageFeatures.peakUsageTimes.length > 0) {
        recommendations.push({
          type: 'usage_scheduling',
          name: 'Usage Scheduling',
          description: \`Your peak usage times are during hours ${usageFeatures.peakUsageTimes.join(', ')}. Consider scheduling heavy usage during off-peak hours.\`,
          confidence: 0.7,
          priority: 'low'
        });
      }

      return {
        success: true,
        data: {
          recommendations,
          usageInsights: {
            dataUsage: {
              total: usageFeatures.totalDataUsage,
              average: usageFeatures.avgDataUsage,
              max: usageFeatures.maxDataUsage,
              growthRate: usageFeatures.usageGrowthRate
            },
            voiceUsage: {
              total: usageFeatures.totalVoiceUsage,
              average: usageFeatures.avgVoiceUsage,
              max: usageFeatures.maxVoiceUsage
            },
            peakUsageTimes: usageFeatures.peakUsageTimes,
            usagePatterns: usageFeatures.usagePatterns
          }
        }
      };
    } catch (error) {
      logger.error('Error getting usage-based recommendations:', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get usage pattern analysis
   * @param {number} customerId - Customer ID
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Usage patterns
   */
  async getUsagePatternAnalysis(customerId, options = {}) {
    try {
      const { months = 3, serviceType = 'all', useAI = false } = options;

      // Check cache first
      const cacheKey = this.generateCacheKey('patterns', customerId, options);
      const cachedResult = cacheManager.get(cacheKey);

      if (cachedResult) {
        logger.debug(`Cache hit for usage pattern analysis: ${cacheKey}`);
        return cachedResult;
      }

      logger.debug(`Cache miss for usage pattern analysis: ${cacheKey}`);

      // Get usage features
      const usageResult = await dataProcessingService.extractUsageFeatures(customerId, {
        months,
        serviceType
      });

      if (!usageResult.success) {
        return usageResult;
      }

      const usageFeatures = usageResult.data;

      // Get anomaly detection
      const anomalyResult = await mlService.detectAnomalies(customerId);

      // Get future usage prediction
      const predictionResult = await mlService.predictFutureUsage(customerId, {
        months: 3,
        serviceType
      });

      let aiInsights = null;

      if (useAI) {
        // Generate AI insights using Gemini API
        aiInsights = await this.getAIUsageInsights(customerId, usageFeatures,
          anomalyResult.success ? anomalyResult.data : null,
          predictionResult.success ? predictionResult.data : null);
      }

      // Prepare result
      const result = {
        success: true,
        data: {
          usageFeatures,
          anomalies: anomalyResult.success ? anomalyResult.data : { anomalies: [] },
          predictions: predictionResult.success ? predictionResult.data : { predictions: [] },
          aiInsights
        }
      };

      // Cache the result
      cacheManager.set(cacheKey, result, CACHE_TTL.USAGE_PATTERNS);

      return result;
    } catch (error) {
      logger.error('Error getting usage pattern analysis:', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get AI-powered usage insights
   * @param {number} customerId - Customer ID
   * @param {Object} usageFeatures - Usage features
   * @param {Object} anomalies - Anomaly detection results
   * @param {Object} predictions - Usage predictions
   * @returns {Promise<Object>} AI insights
   */
  async getAIUsageInsights(customerId, usageFeatures, anomalies, predictions) {
    try {
      // Get customer data
      const customer = await Customer.findByPk(customerId);

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Create a prompt for Gemini API
      const prompt = \`
You are an AI analyst for ONE Albania, a telecom provider.
Analyze the following usage data and provide insights:

Customer Information:
- Company Name: ${customer.companyName}
- Business Type: ${customer.businessType}
- Employee Count: ${customer.employeeCount}

Usage Features:
${JSON.stringify(usageFeatures, null, 2)}

${anomalies ? \`Anomalies:
${JSON.stringify(anomalies, null, 2)}\` : ''}

${predictions ? \`Predictions:
${JSON.stringify(predictions, null, 2)}\` : ''}

Based on this data, provide the following insights:
1. Key Patterns: Identify the most significant usage patterns
2. Anomaly Analysis: Explain any anomalies and their potential causes
3. Future Trends: Predict future usage trends
4. Optimization Opportunities: Suggest ways to optimize usage
5. Business Impact: Explain how these patterns might impact the business

Format your response as a JSON object with the following structure:
{
  "keyPatterns": [
    {
      "pattern": "Pattern description",
      "significance": "Why this matters",
      "confidence": 0.0-1.0
    }
  ],
  "anomalyAnalysis": [...],
  "futureTrends": [...],
  "optimizationOpportunities": [...],
  "businessImpact": [...]
}
\`;

      // Generate insights using Gemini API
      const modelName = process.env.GEMINI_MODEL || "gemini-pro";
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\\{[\\s\\S]*\\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }

      const insights = JSON.parse(jsonMatch[0]);

      return insights;
    } catch (error) {
      logger.error('Error getting AI usage insights:', { error: error.message });

      // Return fallback insights
      return {
        keyPatterns: [],
        anomalyAnalysis: [],
        futureTrends: [],
        optimizationOpportunities: [],
        businessImpact: []
      };
    }
  }

  /**
   * Get cost optimization recommendations
   * @param {number} customerId - Customer ID
   * @param {Object} options - Options for recommendations
   * @returns {Promise<Object>} Cost optimization recommendations
   */
  async getCostOptimizationRecommendations(customerId, options = {}) {
    try {
      const { threshold = 50, useAI = false } = options;

      // Check cache first
      const cacheKey = this.generateCacheKey('optimization', customerId, options);
      const cachedResult = cacheManager.get(cacheKey);

      if (cachedResult) {
        logger.debug(`Cache hit for cost optimization: ${cacheKey}`);
        return cachedResult;
      }

      logger.debug(`Cache miss for cost optimization: ${cacheKey}`);

      // Get customer data
      const customer = await Customer.findByPk(customerId, {
        include: [{
          model: Subscription,
          include: [Service]
        }]
      });

      if (!customer) {
        return {
          success: false,
          error: 'Customer not found'
        };
      }

      // Get usage data for the past 3 months
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);

      const subscriptionIds = customer.Subscriptions.map(sub => sub.id);

      const usageData = await Usage.findAll({
        where: {
          subscriptionId: { [Op.in]: subscriptionIds },
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'ASC']]
      });

      // Calculate utilization for each subscription
      const utilizationBySubscription = {};

      subscriptionIds.forEach(id => {
        utilizationBySubscription[id] = {
          dataUsage: 0,
          dataLimit: 0,
          voiceUsage: 0,
          voiceLimit: 0,
          smsUsage: 0,
          smsLimit: 0,
          utilizationPercentage: 0
        };
      });

      // Process usage data
      usageData.forEach(usage => {
        const subId = usage.subscriptionId;

        if (utilizationBySubscription[subId]) {
          utilizationBySubscription[subId].dataUsage += usage.dataUsage || 0;
          utilizationBySubscription[subId].voiceUsage += usage.voiceUsage || 0;
          utilizationBySubscription[subId].smsUsage += usage.smsUsage || 0;
        }
      });

      // Get subscription details and calculate utilization percentage
      customer.Subscriptions.forEach(subscription => {
        const subId = subscription.id;
        const service = subscription.Service;

        if (utilizationBySubscription[subId]) {
          // Extract limits from service features
          const features = typeof service.features === 'string'
            ? JSON.parse(service.features)
            : service.features;

          utilizationBySubscription[subId].dataLimit = features?.dataLimit || 0;
          utilizationBySubscription[subId].voiceLimit = features?.voiceLimit || 0;
          utilizationBySubscription[subId].smsLimit = features?.smsLimit || 0;

          // Calculate utilization percentage
          let totalUtilization = 0;
          let divisor = 0;

          if (utilizationBySubscription[subId].dataLimit > 0) {
            totalUtilization += (utilizationBySubscription[subId].dataUsage / utilizationBySubscription[subId].dataLimit) * 100;
            divisor += 1;
          }

          if (utilizationBySubscription[subId].voiceLimit > 0) {
            totalUtilization += (utilizationBySubscription[subId].voiceUsage / utilizationBySubscription[subId].voiceLimit) * 100;
            divisor += 1;
          }

          if (utilizationBySubscription[subId].smsLimit > 0) {
            totalUtilization += (utilizationBySubscription[subId].smsUsage / utilizationBySubscription[subId].smsLimit) * 100;
            divisor += 1;
          }

          utilizationBySubscription[subId].utilizationPercentage = divisor > 0
            ? totalUtilization / divisor
            : 0;

          // Add subscription and service details
          utilizationBySubscription[subId].subscriptionId = subscription.id;
          utilizationBySubscription[subId].serviceId = service.id;
          utilizationBySubscription[subId].serviceName = service.name;
          utilizationBySubscription[subId].serviceType = service.type;
          utilizationBySubscription[subId].monthlyCost = subscription.monthlyCost;
        }
      });

      // Generate recommendations
      const recommendations = [];

      // Find underutilized services
      Object.values(utilizationBySubscription).forEach(utilization => {
        if (utilization.utilizationPercentage < threshold) {
          recommendations.push({
            type: 'underutilized_service',
            subscriptionId: utilization.subscriptionId,
            serviceId: utilization.serviceId,
            serviceName: utilization.serviceName,
            serviceType: utilization.serviceType,
            utilizationPercentage: utilization.utilizationPercentage,
            monthlyCost: utilization.monthlyCost,
            potentialSavings: utilization.monthlyCost * (1 - (utilization.utilizationPercentage / 100)),
            recommendation: 'Consider downgrading or removing this underutilized service',
            priority: utilization.utilizationPercentage < 20 ? 'high' : 'medium'
          });
        }
      });

      // Check for duplicate service types
      const serviceTypeCount = {};
      customer.Subscriptions.forEach(subscription => {
        const serviceType = subscription.Service.type;
        if (!serviceTypeCount[serviceType]) {
          serviceTypeCount[serviceType] = [];
        }
        serviceTypeCount[serviceType].push({
          subscriptionId: subscription.id,
          serviceId: subscription.Service.id,
          serviceName: subscription.Service.name,
          monthlyCost: subscription.monthlyCost
        });
      });

      // Find duplicate service types
      Object.entries(serviceTypeCount).forEach(([serviceType, services]) => {
        if (services.length > 1) {
          recommendations.push({
            type: 'duplicate_services',
            serviceType,
            services,
            totalCost: services.reduce((sum, service) => sum + service.monthlyCost, 0),
            recommendation: 'Consider consolidating multiple services of the same type',
            priority: 'medium'
          });
        }
      });

      // Get billing data for the past 6 months
      const billingData = await Billing.findAll({
        where: {
          customerId,
          billingDate: {
            [Op.between]: [new Date(startDate.setMonth(startDate.getMonth() - 3)), endDate]
          }
        },
        order: [['billingDate', 'ASC']]
      });

      // Check for billing cycle optimization
      if (billingData.length > 1) {
        const monthlyAverage = billingData.reduce((sum, billing) => sum + billing.totalAmount, 0) / billingData.length;

        // If monthly billing is over $500, suggest quarterly billing
        if (monthlyAverage > 500) {
          recommendations.push({
            type: 'billing_cycle',
            currentCycle: 'monthly',
            suggestedCycle: 'quarterly',
            averageMonthlyCost: monthlyAverage,
            potentialSavings: monthlyAverage * 0.05 * 3, // Assume 5% discount for quarterly billing
            recommendation: 'Consider switching to quarterly billing for a discount',
            priority: 'low'
          });
        }
      }

      let aiRecommendations = null;

      if (useAI) {
        // Generate AI recommendations using Gemini API
        aiRecommendations = await this.getAICostOptimizationRecommendations(
          customer,
          utilizationBySubscription,
          billingData
        );
      }

      // Prepare result
      const result = {
        success: true,
        data: {
          utilizationBySubscription,
          recommendations,
          aiRecommendations,
          totalPotentialSavings: recommendations
            .filter(r => r.potentialSavings)
            .reduce((sum, r) => sum + r.potentialSavings, 0)
        }
      };

      // Cache the result
      cacheManager.set(cacheKey, result, CACHE_TTL.COST_OPTIMIZATION);

      return result;
    } catch (error) {
      logger.error('Error getting cost optimization recommendations:', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get AI-powered cost optimization recommendations
   * @param {Object} customer - Customer object
   * @param {Object} utilizationBySubscription - Utilization data
   * @param {Array} billingData - Billing data
   * @returns {Promise<Object>} AI recommendations
   */
  async getAICostOptimizationRecommendations(customer, utilizationBySubscription, billingData) {
    try {
      // Create a prompt for Gemini API
      const prompt = \`
You are an AI cost optimization advisor for ONE Albania, a telecom provider.
Analyze the following data and provide cost optimization recommendations:

Customer Information:
- Company Name: ${customer.companyName}
- Business Type: ${customer.businessType}
- Employee Count: ${customer.employeeCount}

Service Utilization:
${JSON.stringify(utilizationBySubscription, null, 2)}

Billing History:
${JSON.stringify(billingData.map(b => ({
  billingDate: b.billingDate,
  totalAmount: b.totalAmount,
  paymentStatus: b.paymentStatus
})), null, 2)}

Based on this data, provide the following recommendations:
1. Service Optimization: Identify services that could be optimized
2. Plan Changes: Suggest plan changes that could save money
3. Usage Optimization: Recommend ways to optimize usage
4. Billing Optimization: Suggest billing changes that could save money
5. Bundle Opportunities: Identify potential service bundles

Format your response as a JSON object with the following structure:
{
  "serviceOptimization": [
    {
      "subscriptionId": 0,
      "recommendation": "Recommendation description",
      "potentialSavings": 0,
      "priority": "high/medium/low"
    }
  ],
  "planChanges": [...],
  "usageOptimization": [...],
  "billingOptimization": [...],
  "bundleOpportunities": [...]
}
\`;

      // Generate recommendations using Gemini API
      const modelName = process.env.GEMINI_MODEL || "gemini-pro";
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\\{[\\s\\S]*\\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }

      const recommendations = JSON.parse(jsonMatch[0]);

      return recommendations;
    } catch (error) {
      logger.error('Error getting AI cost optimization recommendations:', { error: error.message });

      // Return fallback recommendations
      return {
        serviceOptimization: [],
        planChanges: [],
        usageOptimization: [],
        billingOptimization: [],
        bundleOpportunities: []
      };
    }
  }

  /**
   * Get customer segmentation
   * @returns {Promise<Object>} Customer segments
   */
  async getCustomerSegmentation() {
    try {
      // Check cache first
      const cacheKey = 'customer_segmentation';
      const cachedResult = cacheManager.get(cacheKey);

      if (cachedResult) {
        logger.debug(`Cache hit for customer segmentation`);
        return cachedResult;
      }

      logger.debug(`Cache miss for customer segmentation`);

      // Use ML service to perform customer segmentation
      const result = await mlService.customerSegmentation();

      // Cache the result if successful
      if (result.success) {
        cacheManager.set(cacheKey, result, CACHE_TTL.CUSTOMER_SEGMENTATION);
      }

      return result;
    } catch (error) {
      logger.error('Error getting customer segmentation:', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export a singleton instance
export default new RecommendationService();
