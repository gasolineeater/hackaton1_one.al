import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// Check if API key is provided
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
  logger.warn('GEMINI_API_KEY is not properly set in environment variables. AI features will be limited.');
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini model specified in environment variables
const geminiModel = process.env.GEMINI_MODEL || 'gemini-pro';
const geminiProModel = genAI.getGenerativeModel({ model: geminiModel });

/**
 * Generate a response from Gemini API
 * @param {string} prompt - The prompt to send to Gemini
 * @param {Object} options - Additional options for the generation
 * @returns {Promise<Object>} - The generated response
 */
export async function generateResponse(prompt, options = {}) {
  try {
    const defaultTemperature = parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7;
    const defaultMaxTokens = parseInt(process.env.GEMINI_MAX_TOKENS) || 2048;

    const generationConfig = {
      temperature: options.temperature || defaultTemperature,
      topP: options.topP || 0.8,
      topK: options.topK || 40,
      maxOutputTokens: options.maxOutputTokens || defaultMaxTokens,
      ...options
    };

    const result = await geminiProModel.generateContent({
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
    throw new Error('Failed to generate AI content. Please try again later.');
  }
}

/**
 * Parse the Gemini response to extract structured data
 * @param {string} text - The text response from Gemini
 * @param {string} format - The expected format (json, list, etc.)
 * @returns {Object|Array} - The parsed data
 */
export function parseGeminiResponse(text, format = 'json') {
  try {
    if (format === 'json') {
      // Optimized JSON extraction with a single regex pattern
      // This pattern handles various ways JSON might be formatted in the response
      const jsonRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?```|({[\s\S]*})/;
      const match = text.match(jsonRegex);

      if (match) {
        // Use the first capture group that isn't undefined
        const jsonContent = match[1] || match[2] || match[0];

        // Clean up the content (remove leading/trailing whitespace)
        const cleanedContent = jsonContent.trim();

        // Validate that it starts with { and ends with }
        if (cleanedContent.startsWith('{') && cleanedContent.endsWith('}')) {
          return JSON.parse(cleanedContent);
        }
      }

      // If we couldn't extract valid JSON, try a more aggressive approach
      // Look for anything that looks like a JSON object
      const fallbackMatch = text.match(/{[\s\S]*?}/);
      if (fallbackMatch) {
        try {
          return JSON.parse(fallbackMatch[0]);
        } catch (e) {
          // If parsing fails, continue to fallback
          logger.debug('Fallback JSON parsing failed:', { error: e.message });
        }
      }

      // Try to parse the entire text as a last resort
      try {
        return JSON.parse(text);
      } catch (e) {
        // If all parsing attempts fail, return a structured fallback
        return {
          text: text.substring(0, 500) + '...',
          parsedFailed: true,
          message: 'Could not extract valid JSON from response'
        };
      }
    } else if (format === 'list') {
      // Parse as list of items
      return text.split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.trim().substring(1).trim());
    }

    // Default: return the raw text
    return text;
  } catch (error) {
    logger.error('Error parsing Gemini response:', {
      error: error.message,
      textSample: text.substring(0, 200) + '...' // Log a sample of the text for debugging
    });
    return {
      error: 'Failed to parse AI response',
      fallbackData: {
        message: 'The AI generated a response that could not be properly processed. Please try again.'
      }
    };
  }
}

export default {
  generateResponse,
  parseGeminiResponse
};
