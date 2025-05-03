import { generateResponse, parseGeminiResponse } from './utils/geminiClient.js';
import dotenv from 'dotenv';

dotenv.config();

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API connection...');
    
    const prompt = `
      You are an API for a telecom company.
      Generate a simple test response with the following JSON structure:
      {
        "status": "success",
        "message": "Gemini API is working correctly",
        "timestamp": "current date and time",
        "capabilities": ["list", "of", "capabilities"]
      }
      
      Return ONLY the JSON without any additional text.
    `;
    
    const response = await generateResponse(prompt);
    const parsedResponse = parseGeminiResponse(response.text, 'json');
    
    console.log('Gemini API Response:');
    console.log(JSON.stringify(parsedResponse, null, 2));
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    console.error('Make sure your GEMINI_API_KEY is set correctly in the .env file');
  }
}

testGeminiAPI();
