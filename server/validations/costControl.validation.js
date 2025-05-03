/**
 * Cost Control validation schemas
 */

const Joi = require('joi');

// Get cost breakdown validation schema
const getCostBreakdown = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

// Generate cost breakdown validation schema
const generateCostBreakdown = {
  params: Joi.object().keys({
    year: Joi.number().integer().min(2000).max(2100).required(),
    month: Joi.number().integer().min(1).max(12).required()
  })
};

// Export financial report validation schema
const exportFinancialReport = {
  query: Joi.object().keys({
    format: Joi.string().valid('csv', 'json').default('csv'),
    type: Joi.string().valid('monthly', 'line', 'department').default('monthly'),
    month: Joi.number().integer().min(1).max(12)
      .when('type', {
        is: Joi.string().valid('line', 'department'),
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
    year: Joi.number().integer().min(2000).max(2100).default(new Date().getFullYear())
  })
};

// Get cost trends validation schema
const getCostTrends = {
  query: Joi.object().keys({
    months: Joi.number().integer().min(1).max(36).default(12)
  })
};

// Get cost by category validation schema
const getCostByCategory = {
  query: Joi.object().keys({
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(2000).max(2100)
  })
};

// Get cost by line validation schema
const getCostByLine = {
  query: Joi.object().keys({
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(2000).max(2100)
  })
};

// Get cost by department validation schema
const getCostByDepartment = {
  query: Joi.object().keys({
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(2000).max(2100)
  })
};

module.exports = {
  getCostBreakdown,
  generateCostBreakdown,
  exportFinancialReport,
  getCostTrends,
  getCostByCategory,
  getCostByLine,
  getCostByDepartment
};
