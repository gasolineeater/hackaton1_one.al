import { parseGeminiResponse } from '../../utils/geminiClient.js';

// Mock dependencies
jest.mock('../../utils/logger.js');

describe('Gemini Client', () => {
  describe('parseGeminiResponse', () => {
    it('should parse JSON from code blocks', () => {
      const response = `
        Here's the recommendation:
        
        \`\`\`json
        {
          "recommendations": [
            {
              "id": "rec1",
              "name": "Business Internet Pro",
              "description": "High-speed internet for businesses",
              "score": 0.95
            },
            {
              "id": "rec2",
              "name": "Cloud PBX",
              "description": "Cloud-based phone system",
              "score": 0.85
            }
          ]
        }
        \`\`\`
        
        Let me know if you need anything else!
      `;
      
      const expected = {
        recommendations: [
          {
            id: "rec1",
            name: "Business Internet Pro",
            description: "High-speed internet for businesses",
            score: 0.95
          },
          {
            id: "rec2",
            name: "Cloud PBX",
            description: "Cloud-based phone system",
            score: 0.85
          }
        ]
      };
      
      const result = parseGeminiResponse(response, 'json');
      
      expect(result).toEqual(expected);
    });

    it('should parse JSON without language specifier', () => {
      const response = `
        Here's the recommendation:
        
        \`\`\`
        {
          "recommendations": [
            {
              "id": "rec1",
              "name": "Business Internet Pro",
              "description": "High-speed internet for businesses",
              "score": 0.95
            }
          ]
        }
        \`\`\`
      `;
      
      const expected = {
        recommendations: [
          {
            id: "rec1",
            name: "Business Internet Pro",
            description: "High-speed internet for businesses",
            score: 0.95
          }
        ]
      };
      
      const result = parseGeminiResponse(response, 'json');
      
      expect(result).toEqual(expected);
    });

    it('should parse JSON directly from response', () => {
      const response = `{
        "recommendations": [
          {
            "id": "rec1",
            "name": "Business Internet Pro",
            "description": "High-speed internet for businesses",
            "score": 0.95
          }
        ]
      }`;
      
      const expected = {
        recommendations: [
          {
            id: "rec1",
            name: "Business Internet Pro",
            description: "High-speed internet for businesses",
            score: 0.95
          }
        ]
      };
      
      const result = parseGeminiResponse(response, 'json');
      
      expect(result).toEqual(expected);
    });

    it('should handle malformed JSON gracefully', () => {
      const response = `
        Here's the recommendation:
        
        \`\`\`json
        {
          "recommendations": [
            {
              "id": "rec1",
              "name": "Business Internet Pro",
              "description": "High-speed internet for businesses",
              "score": 0.95,
            }
          ]
        }
        \`\`\`
      `;
      
      const result = parseGeminiResponse(response, 'json');
      
      expect(result).toHaveProperty('parsedFailed');
      expect(result).toHaveProperty('message');
    });

    it('should parse lists from response', () => {
      const response = `
        Here are the recommendations:
        
        - Business Internet Pro: High-speed internet for businesses
        - Cloud PBX: Cloud-based phone system
        - Mobile Data: Data plans for mobile devices
      `;
      
      const expected = [
        'Business Internet Pro: High-speed internet for businesses',
        'Cloud PBX: Cloud-based phone system',
        'Mobile Data: Data plans for mobile devices'
      ];
      
      const result = parseGeminiResponse(response, 'list');
      
      expect(result).toEqual(expected);
    });

    it('should return raw text for non-JSON/list formats', () => {
      const response = 'This is a plain text response.';
      
      const result = parseGeminiResponse(response, 'text');
      
      expect(result).toEqual(response);
    });
  });
});
