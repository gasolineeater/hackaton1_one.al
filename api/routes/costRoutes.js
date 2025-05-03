import express from 'express';
import { generateResponse, parseGeminiResponse } from '../utils/geminiClient.js';

const router = express.Router();

/**
 * @route GET /api/costs/overview
 * @desc Get cost overview for the company
 */
router.get('/overview', async (req, res) => {
  try {
    const { period = 'monthly', companySize = 'medium' } = req.query;
    
    const prompt = `
      You are an API for a telecom company called ONE Albania.
      Generate a realistic cost overview for a ${companySize}-sized business's telecom expenses.
      The period is ${period} (monthly, quarterly, or yearly).
      
      Format the response as a JSON object with the following properties:
      - totalCost: total cost for the period in EUR
      - breakdown: object with cost categories (mobile, internet, fixed, cloud, etc.)
      - comparisonToPrevious: percentage change from previous period
      - averageCostPerEmployee: average cost per employee
      - topExpenses: array of the highest cost services
      - savingOpportunities: array of potential savings with estimated amounts
      - costTrend: array of points showing cost trend over last 6 periods
      
      Make the data realistic for an Albanian business telecom context.
      Return ONLY the JSON without any additional text.
    `;

    const response = await generateResponse(prompt);
    const costOverview = parseGeminiResponse(response.text, 'json');

    res.json({
      status: 'success',
      data: costOverview
    });
  } catch (error) {
    console.error('Cost overview error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve cost overview',
      error: error.message
    });
  }
});

/**
 * @route GET /api/costs/forecast
 * @desc Get cost forecast for upcoming periods
 */
router.get('/forecast', async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    const prompt = `
      You are an API for a telecom company called ONE Albania.
      Generate a realistic cost forecast for the next ${months} months for a business's telecom expenses.
      
      Format the response as a JSON object with the following properties:
      - forecastPeriods: array of the next ${months} months with:
        - period: month and year
        - projectedCost: forecasted cost in EUR
        - changeFromCurrent: percentage change
        - confidenceLevel: how confident the prediction is (high, medium, low)
      - factors: array of factors influencing the forecast
      - assumptions: array of assumptions made in the forecast
      - recommendations: array of actions to optimize costs
      - worstCaseScenario: projected highest possible cost
      - bestCaseScenario: projected lowest possible cost
      
      Make the data realistic for an Albanian business telecom context.
      Return ONLY the JSON without any additional text.
    `;

    const response = await generateResponse(prompt);
    const forecast = parseGeminiResponse(response.text, 'json');

    res.json({
      status: 'success',
      data: forecast
    });
  } catch (error) {
    console.error('Cost forecast error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate cost forecast',
      error: error.message
    });
  }
});

/**
 * @route GET /api/costs/optimization
 * @desc Get cost optimization recommendations
 */
router.get('/optimization', async (req, res) => {
  try {
    const { budget, priority = 'balanced' } = req.query;
    
    const prompt = `
      You are an API for a telecom company called ONE Albania.
      Generate cost optimization recommendations for a business's telecom expenses.
      ${budget ? `The target budget is ${budget} EUR per month.` : ''}
      The optimization priority is "${priority}" (can be "cost", "performance", or "balanced").
      
      Format the response as a JSON object with the following properties:
      - currentEstimatedCost: current monthly cost in EUR
      - targetCost: recommended target cost in EUR
      - potentialSavings: amount that could be saved in EUR
      - timeToImplement: estimated time to implement all recommendations
      - recommendations: array of specific recommendations with:
        - id: unique identifier
        - title: short title of the recommendation
        - description: detailed description
        - impact: high, medium, or low
        - savingsAmount: estimated savings in EUR
        - implementationEffort: high, medium, or low
        - steps: array of implementation steps
      - prioritizedPlan: ordered list of recommendations in implementation order
      
      Make the recommendations realistic and specific to telecom services.
      Return ONLY the JSON without any additional text.
    `;

    const response = await generateResponse(prompt);
    const optimization = parseGeminiResponse(response.text, 'json');

    res.json({
      status: 'success',
      data: optimization
    });
  } catch (error) {
    console.error('Cost optimization error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate cost optimization recommendations',
      error: error.message
    });
  }
});

export default router;
