import { generateResponse, parseGeminiResponse } from '../utils/geminiClient.js';
import logger from '../utils/logger.js';
import cacheManager from '../utils/cacheManager.js';
import crypto from 'crypto';

/**
 * AI Service
 * Centralizes AI integration logic for the application
 */
class AIService {
  /**
   * Generate cache key for AI requests
   * @param {string} prefix - Cache key prefix
   * @param {string} prompt - The prompt text
   * @returns {string} Cache key
   */
  generateCacheKey(prefix, prompt) {
    // Create a hash of the prompt to keep the key length reasonable
    const promptHash = crypto
      .createHash('md5')
      .update(prompt)
      .digest('hex');
    
    return `ai:${prefix}:${promptHash}`;
  }
  
  /**
   * Get AI-generated service recommendations
   * @param {Object} options - Options for recommendations
   * @returns {Promise<Object>} AI-generated recommendations
   */
  async getServiceRecommendations(options = {}) {
    try {
      const {
        businessType = 'general',
        employeeCount = 50,
        budget,
        currentServices,
        priority = 'balanced'
      } = options;
      
      // Create prompt for service recommendations
      const prompt = `
        You are an AI recommendation engine for ONE Albania, a telecom company.
        Generate personalized service recommendations for a ${businessType} business with ${employeeCount} employees.
        ${budget ? `The monthly budget is ${budget} EUR.` : ''}
        ${currentServices ? `Current services being used: ${currentServices}` : ''}
        Priority for recommendations: ${priority} (can be cost, performance, features, or balanced)

        Format the response as a JSON object with the following properties:
        - recommendedServices: array of recommended services with:
          - id: unique identifier
          - name: service name
          - description: service description
          - monthlyCost: cost in EUR
          - benefits: array of benefits for this business
          - features: key features
          - whyRecommended: explanation of why this service is recommended
          - fitScore: how well the service fits the business (0-100)
        - packageOptions: array of service bundles or packages
        - potentialSavings: if switching from current services
        - implementationPlan: suggested implementation steps
        - alternatives: alternative options to consider

        Make recommendations specific to the Albanian market and realistic for ONE Albania's services.
        Return ONLY the JSON without any additional text.
      `;
      
      // Check cache
      const cacheKey = this.generateCacheKey('recommendations', prompt);
      const cachedResult = cacheManager.get(cacheKey);
      
      if (cachedResult) {
        logger.debug(`Cache hit for AI service recommendations: ${cacheKey}`);
        return {
          success: true,
          data: cachedResult,
          source: 'gemini-cached'
        };
      }
      
      // Generate recommendations
      const response = await generateResponse(prompt);
      const recommendations = parseGeminiResponse(response.text, 'json');
      
      // Cache result
      cacheManager.set(cacheKey, recommendations, 3600); // 1 hour
      
      return {
        success: true,
        data: recommendations,
        source: 'gemini'
      };
    } catch (error) {
      logger.error('AI service recommendations error:', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: 'Failed to generate AI recommendations',
        source: 'error'
      };
    }
  }
  
  /**
   * Get AI-generated cost optimization recommendations
   * @param {Object} options - Options for optimization
   * @returns {Promise<Object>} AI-generated optimizations
   */
  async getCostOptimizations(options = {}) {
    try {
      const {
        usageData,
        currentServices,
        optimizationGoal = 'cost'
      } = options;
      
      // Create prompt for optimization recommendations
      const prompt = `
        You are an AI optimization engine for ONE Albania, a telecom company.
        Generate optimization recommendations based on the following:
        ${usageData ? `Usage data: ${usageData}` : 'Use typical SME usage patterns.'}
        ${currentServices ? `Current services: ${currentServices}` : 'Assume typical SME telecom services.'}
        Optimization goal: ${optimizationGoal} (can be cost, performance, efficiency, or balanced)

        Format the response as a JSON object with the following properties:
        - currentState: assessment of current service utilization
        - inefficiencies: identified inefficiencies or waste
        - optimizationRecommendations: array of specific recommendations with:
          - id: unique identifier
          - title: recommendation title
          - description: detailed description
          - impact: expected impact (high, medium, low)
          - effort: implementation effort (high, medium, low)
          - savings: estimated monthly savings in EUR
          - steps: implementation steps
        - prioritizedActions: ordered list of actions to take
        - expectedOutcomes: what to expect after implementation
        - monitoringMetrics: what to monitor to ensure optimization

        Make recommendations specific to telecom services and realistic for Albanian businesses.
        Return ONLY the JSON without any additional text.
      `;
      
      // Check cache
      const cacheKey = this.generateCacheKey('optimizations', prompt);
      const cachedResult = cacheManager.get(cacheKey);
      
      if (cachedResult) {
        logger.debug(`Cache hit for AI cost optimizations: ${cacheKey}`);
        return {
          success: true,
          data: cachedResult,
          source: 'gemini-cached'
        };
      }
      
      // Generate optimizations
      const response = await generateResponse(prompt);
      const optimizations = parseGeminiResponse(response.text, 'json');
      
      // Cache result
      cacheManager.set(cacheKey, optimizations, 3600); // 1 hour
      
      return {
        success: true,
        data: optimizations,
        source: 'gemini'
      };
    } catch (error) {
      logger.error('AI cost optimizations error:', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: 'Failed to generate AI optimizations',
        source: 'error'
      };
    }
  }
  
  /**
   * Get AI-generated future technology recommendations
   * @param {Object} options - Options for future tech
   * @returns {Promise<Object>} AI-generated future tech recommendations
   */
  async getFutureTechRecommendations(options = {}) {
    try {
      const {
        industryType = 'general',
        timeframe = 'short',
        currentTech
      } = options;
      
      // Create prompt for future tech recommendations
      const prompt = `
        You are an AI future technology advisor for ONE Albania, a telecom company.
        Generate recommendations for future telecom technologies for a ${industryType} business.
        Timeframe: ${timeframe} (short = 1 year, medium = 2-3 years, long = 5+ years)
        ${currentTech ? `Current technology stack: ${currentTech}` : ''}

        Format the response as a JSON object with the following properties:
        - emergingTechnologies: array of relevant emerging technologies with:
          - name: technology name
          - description: what it is
          - relevance: why it's relevant to this business
          - timeToAdoption: when the business should consider adopting
          - potentialImpact: potential business impact
          - implementationComplexity: complexity to implement
          - estimatedCosts: rough cost estimate
        - industryTrends: relevant industry trends
        - preparationSteps: how to prepare for these technologies
        - riskAssessment: risks of adoption vs. non-adoption
        - competitiveAnalysis: how adoption affects competitive position

        Focus on telecom-related technologies relevant to Albanian businesses.
        Return ONLY the JSON without any additional text.
      `;
      
      // Check cache
      const cacheKey = this.generateCacheKey('futureTech', prompt);
      const cachedResult = cacheManager.get(cacheKey);
      
      if (cachedResult) {
        logger.debug(`Cache hit for AI future tech: ${cacheKey}`);
        return {
          success: true,
          data: cachedResult,
          source: 'gemini-cached'
        };
      }
      
      // Generate future tech recommendations
      const response = await generateResponse(prompt);
      const futureTech = parseGeminiResponse(response.text, 'json');
      
      // Cache result
      cacheManager.set(cacheKey, futureTech, 86400); // 24 hours
      
      return {
        success: true,
        data: futureTech,
        source: 'gemini'
      };
    } catch (error) {
      logger.error('AI future tech recommendations error:', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: 'Failed to generate AI future tech recommendations',
        source: 'error'
      };
    }
  }
  
  /**
   * Get AI-enhanced analysis of customer data
   * @param {Object} data - Customer data to analyze
   * @param {string} analysisType - Type of analysis to perform
   * @returns {Promise<Object>} AI-generated analysis
   */
  async analyzeCustomerData(data, analysisType = 'usage') {
    try {
      // Create prompt based on analysis type
      let prompt;
      
      switch (analysisType) {
        case 'usage':
          prompt = `
            You are an AI analyst for ONE Albania, a telecom provider.
            Analyze the following usage data and provide insights:
            
            Customer Data:
            ${JSON.stringify(data, null, 2)}
            
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
          `;
          break;
          
        case 'billing':
          prompt = `
            You are an AI financial analyst for ONE Albania, a telecom provider.
            Analyze the following billing data and provide insights:
            
            Billing Data:
            ${JSON.stringify(data, null, 2)}
            
            Based on this data, provide the following insights:
            1. Spending Patterns: Identify the most significant spending patterns
            2. Cost Drivers: Identify the main cost drivers
            3. Saving Opportunities: Suggest ways to reduce costs
            4. Budget Recommendations: Provide budget recommendations
            5. ROI Analysis: Analyze return on investment for services
            
            Format your response as a JSON object with appropriate structure.
          `;
          break;
          
        default:
          prompt = `
            You are an AI analyst for ONE Albania, a telecom provider.
            Analyze the following data and provide insights:
            
            Data:
            ${JSON.stringify(data, null, 2)}
            
            Provide a comprehensive analysis in JSON format.
          `;
      }
      
      // Check cache
      const cacheKey = this.generateCacheKey(`analysis-${analysisType}`, JSON.stringify(data));
      const cachedResult = cacheManager.get(cacheKey);
      
      if (cachedResult) {
        logger.debug(`Cache hit for AI analysis (${analysisType}): ${cacheKey}`);
        return {
          success: true,
          data: cachedResult,
          source: 'gemini-cached'
        };
      }
      
      // Generate analysis
      const response = await generateResponse(prompt);
      const analysis = parseGeminiResponse(response.text, 'json');
      
      // Cache result
      cacheManager.set(cacheKey, analysis, 1800); // 30 minutes
      
      return {
        success: true,
        data: analysis,
        source: 'gemini'
      };
    } catch (error) {
      logger.error(`AI analysis error (${analysisType}):`, { error: error.message, stack: error.stack });
      return {
        success: false,
        error: 'Failed to generate AI analysis',
        source: 'error'
      };
    }
  }
}

// Export singleton instance
export default new AIService();
