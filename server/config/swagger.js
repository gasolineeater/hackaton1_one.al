const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ONE Albania SME Dashboard API',
      version: '1.0.0',
      description: 'API documentation for ONE Albania SME Dashboard',
      contact: {
        name: 'ONE Albania',
        url: 'https://one.al',
        email: 'support@one.al'
      },
      license: {
        name: 'Proprietary',
        url: 'https://one.al/terms'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './models/*.js',
    './controllers/*.js',
    './middleware/*.js',
    './docs/*.yaml'
  ]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Configure Swagger middleware
 * @param {Object} app - Express app
 */
const setupSwagger = (app) => {
  // Serve Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'ONE Albania SME Dashboard API Documentation'
  }));

  // Serve Swagger spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Swagger documentation available at /api-docs');
};

module.exports = { setupSwagger };
