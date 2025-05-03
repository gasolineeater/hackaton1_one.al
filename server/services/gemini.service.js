/**
 * Gemini API Service
 * Provides integration with Google's Gemini AI models
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Get the Gemini model specified in environment variables
const geminiModel = process.env.GEMINI_MODEL || 'gemini-pro';

/**
 * Generate a response from Gemini API
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} options - Additional options for the generation
 * @returns {Promise<Object>} - The generated response
 */
async function generateResponse(prompt, options = {}) {
  try {
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      logger.warn('GEMINI_API_KEY is not properly set in environment variables. AI features will be limited.');
      throw new Error('Gemini API key not configured');
    }

    const defaultTemperature = parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7;
    const defaultMaxTokens = parseInt(process.env.GEMINI_MAX_TOKENS) || 2048;

    const generationConfig = {
      temperature: options.temperature || defaultTemperature,
      topP: options.topP || 0.8,
      topK: options.topK || 40,
      maxOutputTokens: options.maxOutputTokens || defaultMaxTokens,
      ...options
    };

    const model = genAI.getGenerativeModel({ model: geminiModel });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    return {
      text: response.text(),
      candidates: response.candidates,
      promptFeedback: response.promptFeedback,
    };
  } catch (error) {
    logger.error('Error generating content with Gemini:', {
      error: error.message,
      prompt: prompt.substring(0, 100) + '...' // Log only the beginning of the prompt for debugging
    });
    throw new Error('Failed to generate AI content: ' + error.message);
  }
}

/**
 * Parse JSON response from Gemini
 * @param {string} text - The text response from Gemini
 * @param {string} format - Expected format ('json' or 'text')
 * @returns {Object|string} - Parsed response
 */
function parseGeminiResponse(text, format = 'json') {
  try {
    if (format === 'json') {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      return JSON.parse(jsonMatch[0]);
    }
    return text;
  } catch (error) {
    logger.error('Error parsing Gemini response:', {
      error: error.message,
      text: text.substring(0, 100) + '...' // Log only the beginning of the text for debugging
    });
    
    // Return a fallback object for JSON format
    if (format === 'json') {
      return { error: 'Failed to parse response', fallback: true };
    }
    return text;
  }
}

/**
 * Generate AI recommendations for service optimization
 * @param {Object} options - Options for recommendations
 * @returns {Promise<Array>} - Array of recommendations
 */
async function generateRecommendations(options = {}) {
  try {
    const {
      userId,
      usageData,
      businessType = 'SME',
      employeeCount = 50,
      budget = null,
      currentServices = null,
      priority = 'balanced'
    } = options;

    // Create prompt for service recommendations
    const prompt = `
      You are an AI recommendation engine for ONE Albania, a telecom company.
      Generate personalized service recommendations for a ${businessType} business with ${employeeCount} employees.
      ${budget ? `The monthly budget is ${budget} EUR.` : ''}
      ${currentServices ? `Current services being used: ${currentServices}` : ''}
      Priority for recommendations: ${priority} (can be cost, performance, features, or balanced)
      
      Generate 3-5 specific recommendations in the following JSON format:
      {
        "recommendations": [
          {
            "title": "Recommendation title",
            "description": "Detailed description of the recommendation",
            "savings_amount": 50.00,
            "priority": "high/medium/low",
            "type": "data_plan_downgrade/shared_data_plan/international_calling_plan"
          }
        ]
      }
      
      Make recommendations specific to the Albanian market and realistic for ONE Albania's services.
      Return ONLY the JSON without any additional text.
    `;

    // Generate recommendations
    const response = await generateResponse(prompt);
    const recommendations = parseGeminiResponse(response.text, 'json');
    
    return recommendations.recommendations || [];
  } catch (error) {
    logger.error('Error generating AI recommendations:', error);
    // Return empty array as fallback
    return [];
  }
}

/**
 * Generate cost optimization recommendations
 * @param {Object} options - Options for optimization
 * @returns {Promise<Array>} - Array of optimization recommendations
 */
async function generateCostOptimizations(options = {}) {
  try {
    const {
      userId,
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
      
      Generate 3-5 specific optimization recommendations in the following JSON format:
      {
        "optimizations": [
          {
            "title": "Optimization title",
            "description": "Detailed description of the optimization",
            "potential_savings": 50.00,
            "implementation_difficulty": "easy/medium/hard",
            "impact": "high/medium/low",
            "type": "data_plan/shared_services/usage_optimization/contract_negotiation"
          }
        ]
      }
      
      Make recommendations specific to telecom services and realistic for Albanian businesses.
      Return ONLY the JSON without any additional text.
    `;
    
    // Generate optimizations
    const response = await generateResponse(prompt);
    const optimizations = parseGeminiResponse(response.text, 'json');
    
    return optimizations.optimizations || [];
  } catch (error) {
    logger.error('Error generating cost optimizations:', error);
    // Return empty array as fallback
    return [];
  }
}

module.exports = {
  generateResponse,
  parseGeminiResponse,
  generateRecommendations,
  generateCostOptimizations
};
