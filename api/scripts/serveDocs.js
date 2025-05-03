import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.DOCS_PORT || 3003;

// Path to the Swagger JSON file
const swaggerPath = path.join(__dirname, '../public/swagger.json');

// Check if the Swagger JSON file exists
if (!fs.existsSync(swaggerPath)) {
  console.error('Swagger JSON file not found. Please run "npm run docs" first.');
  process.exit(1);
}

// Parse the Swagger JSON file
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ONE Albania API Documentation',
  customfavIcon: '/favicon.ico'
}));

// Redirect root to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Start the server
app.listen(PORT, () => {
  console.log(`API documentation server running at http://localhost:${PORT}/api-docs`);
});
