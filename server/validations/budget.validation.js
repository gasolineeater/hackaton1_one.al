/**
 * Budget validation schemas
 */

const Joi = require('joi');

// Create budget validation schema
const createBudget = {
  body: Joi.object().keys({
    entity_type: Joi.string().valid('line', 'department', 'company').required(),
    entity_id: Joi.alternatives().conditional('entity_type', {
      is: 'company',
      then: Joi.any().optional(),
      otherwise: Joi.number().integer().required()
    }),
    entity_name: Joi.string().required().min(2).max(100),
    amount: Joi.number().positive().required(),
    period: Joi.string().valid('monthly', 'quarterly', 'yearly').default('monthly'),
    currency: Joi.string().length(3).default('EUR'),
    alert_threshold: Joi.number().integer().min(1).max(100).default(80),
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).allow(null)
  })
};

// Update budget validation schema
const updateBudget = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    entity_name: Joi.string().min(2).max(100),
    amount: Joi.number().positive(),
    period: Joi.string().valid('monthly', 'quarterly', 'yearly'),
    currency: Joi.string().length(3),
    alert_threshold: Joi.number().integer().min(1).max(100),
    start_date: Joi.date().iso(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).allow(null)
  }).min(1)
};

// Get budget validation schema
const getBudget = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

// Delete budget validation schema
const deleteBudget = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

module.exports = {
  createBudget,
  updateBudget,
  getBudget,
  deleteBudget
};
