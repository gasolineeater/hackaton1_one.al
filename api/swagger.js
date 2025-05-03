export default {
  openapi: '3.0.0',
  info: {
    title: 'ONE Albania SME Dashboard API',
    version: '1.0.0',
    description: 'API documentation for ONE Albania SME Dashboard',
    contact: {
      name: 'ONE Albania Support',
      email: 'support@onealbania.al',
      url: 'https://www.onealbania.al'
    },
    license: {
      name: 'Proprietary',
      url: 'https://www.onealbania.al/terms'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Development server'
    },
    {
      url: 'https://api.dashboard.onealbania.al/api',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error'
          },
          message: {
            type: 'string',
            example: 'Error message'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'email'
                },
                message: {
                  type: 'string',
                  example: 'Invalid email format'
                }
              }
            }
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          username: {
            type: 'string',
            example: 'johndoe'
          },
          email: {
            type: 'string',
            example: 'john.doe@example.com'
          },
          firstName: {
            type: 'string',
            example: 'John'
          },
          lastName: {
            type: 'string',
            example: 'Doe'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin', 'manager'],
            example: 'user'
          },
          customerId: {
            type: 'integer',
            example: 1
          },
          isActive: {
            type: 'boolean',
            example: true
          },
          lastLogin: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00Z'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00Z'
          }
        }
      },
      Service: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          name: {
            type: 'string',
            example: 'Business Internet'
          },
          description: {
            type: 'string',
            example: 'High-speed internet for businesses'
          },
          type: {
            type: 'string',
            example: 'internet'
          },
          price: {
            type: 'number',
            example: 49.99
          },
          features: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['100 Mbps', 'Static IP', '24/7 Support']
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-01-01T00:00:00Z'
          }
        }
      },
      Recommendation: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'rec-123'
          },
          type: {
            type: 'string',
            example: 'service_upgrade'
          },
          name: {
            type: 'string',
            example: 'Upgrade to Business Internet Pro'
          },
          description: {
            type: 'string',
            example: 'Upgrade to our premium business internet package for better performance'
          },
          confidence: {
            type: 'number',
            example: 0.85
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            example: 'high'
          }
        }
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Authentication information is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              status: 'error',
              message: 'Authentication required'
            }
          }
        }
      },
      ForbiddenError: {
        description: 'User does not have permission to access the resource',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              status: 'error',
              message: 'Insufficient permissions'
            }
          }
        }
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              status: 'error',
              message: 'Validation failed',
              errors: [
                {
                  field: 'email',
                  message: 'Invalid email format'
                },
                {
                  field: 'password',
                  message: 'Password must be at least 8 characters long'
                }
              ]
            }
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and authorization endpoints'
    },
    {
      name: 'Services',
      description: 'Service management endpoints'
    },
    {
      name: 'Costs',
      description: 'Cost management endpoints'
    },
    {
      name: 'Analytics',
      description: 'Analytics and reporting endpoints'
    },
    {
      name: 'Recommendations',
      description: 'AI-powered recommendation endpoints'
    },
    {
      name: 'Notifications',
      description: 'Notification management endpoints'
    },
    {
      name: 'Telecom',
      description: 'Telecom service integration endpoints'
    }
  ],
  paths: {}
};
