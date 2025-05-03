import express from 'express';
import { generateResponse, parseGeminiResponse } from '../utils/geminiClient.js';

const router = express.Router();

/**
 * @route GET /api/services
 * @desc Get all telecom services
 */
router.get('/', async (req, res) => {
  try {
    const prompt = `
      You are an API for a telecom company called ONE Albania. 
      Generate a comprehensive list of telecom services offered to SME customers.
      Include service name, description, monthly cost, and features.
      Format the response as a JSON array with at least 10 different services.
      Each service should have the following properties:
      - id: a unique identifier
      - name: service name
      - description: brief description
      - monthlyCost: cost in EUR
      - features: array of features
      - category: one of "Mobile", "Internet", "Fixed Line", "Cloud", "IoT"
      
      Return ONLY the JSON without any additional text.
    `;

    const response = await generateResponse(prompt);
    const services = parseGeminiResponse(response.text, 'json');

    res.json({
      status: 'success',
      data: services
    });
  } catch (error) {
    console.error('Service listing error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve services',
      error: error.message
    });
  }
});

/**
 * @route GET /api/services/:id
 * @desc Get a specific service by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const prompt = `
      You are an API for a telecom company called ONE Albania.
      Generate detailed information about a telecom service with ID ${id}.
      Make sure the information is realistic for an Albanian telecom company.
      Format the response as a JSON object with the following properties:
      - id: "${id}"
      - name: service name
      - description: detailed description
      - monthlyCost: cost in EUR
      - setupFee: one-time setup fee in EUR
      - contractLength: in months
      - features: array of features with descriptions
      - limitations: array of limitations or restrictions
      - category: one of "Mobile", "Internet", "Fixed Line", "Cloud", "IoT"
      - popularity: a number between 1-10 indicating how popular this service is
      - bestFor: array of business types this service is best suited for
      
      Return ONLY the JSON without any additional text.
    `;

    const response = await generateResponse(prompt);
    const service = parseGeminiResponse(response.text, 'json');

    res.json({
      status: 'success',
      data: service
    });
  } catch (error) {
    console.error('Service detail error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve service details',
      error: error.message
    });
  }
});

/**
 * @route GET /api/services/compare
 * @desc Compare multiple services
 */
router.get('/compare', async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({
        status: 'error',
        message: 'Service IDs are required for comparison'
      });
    }
    
    const serviceIds = ids.split(',');
    
    const prompt = `
      You are an API for a telecom company called ONE Albania.
      Generate a comparison between telecom services with IDs: ${serviceIds.join(', ')}.
      For each service, include:
      - name
      - monthlyCost
      - key features
      - pros
      - cons
      - best use cases
      
      Also include a section called "comparisonPoints" that highlights the main differences between these services.
      Format the response as a JSON object with an array of services and the comparison points.
      
      Return ONLY the JSON without any additional text.
    `;

    const response = await generateResponse(prompt);
    const comparison = parseGeminiResponse(response.text, 'json');

    res.json({
      status: 'success',
      data: comparison
    });
  } catch (error) {
    console.error('Service comparison error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to compare services',
      error: error.message
    });
  }
});

export default router;
