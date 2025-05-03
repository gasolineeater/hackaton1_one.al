import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerDefinition from '../swagger.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: [
    './routes/*.js',
    './models/*.js',
    './middleware/*.js'
  ]
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Ensure the public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the swagger.json file
fs.writeFileSync(
  path.join(publicDir, 'swagger.json'),
  JSON.stringify(swaggerSpec, null, 2)
);

console.log('Swagger documentation generated successfully!');
console.log('Run "npm run docs:serve" to view the documentation.');
