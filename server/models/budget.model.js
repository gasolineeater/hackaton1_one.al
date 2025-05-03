/**
 * Budget Model
 * Manages budget limits and thresholds for telecom lines and departments
 */

const { pool } = require('../config/db.config');
const logger = require('../utils/logger');

class Budget {
  constructor(budget) {
    this.id = budget.id;
    this.user_id = budget.user_id;
    this.entity_type = budget.entity_type; // 'line', 'department', 'company'
    this.entity_id = budget.entity_id; // line_id, department_id, or null for company
    this.entity_name = budget.entity_name; // Line number, department name, or company name
    this.amount = budget.amount;
    this.period = budget.period; // 'monthly', 'quarterly', 'yearly'
    this.currency = budget.currency || 'EUR';
    this.alert_threshold = budget.alert_threshold; // Percentage (e.g., 80 for 80%)
    this.start_date = budget.start_date;
    this.end_date = budget.end_date;
    this.created_at = budget.created_at;
    this.updated_at = budget.updated_at;
  }

  /**
   * Create a new budget
   * @param {Object} budgetData - Budget data
   * @returns {Promise<Object>} - Created budget
   */
  static async create(budgetData) {
    try {
      // Check if budget already exists for this entity
      if (budgetData.entity_type && budgetData.entity_id) {
        const existingBudget = await this.findByEntity(
          budgetData.user_id,
          budgetData.entity_type,
          budgetData.entity_id
        );

        if (existingBudget) {
          // Update existing budget instead of creating a new one
          return await this.update(existingBudget.id, budgetData);
        }
      }

      const [result] = await pool.execute(
        `INSERT INTO budgets (
          user_id, entity_type, entity_id, entity_name, amount, 
          period, currency, alert_threshold, start_date, end_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          budgetData.user_id,
          budgetData.entity_type,
          budgetData.entity_id,
          budgetData.entity_name,
          budgetData.amount,
          budgetData.period || 'monthly',
          budgetData.currency || 'EUR',
          budgetData.alert_threshold || 80,
          budgetData.start_date || new Date(),
          budgetData.end_date
        ]
      );

      const [budget] = await pool.execute('SELECT * FROM budgets WHERE id = ?', [result.insertId]);
      return budget[0];
    } catch (error) {
      logger.error('Error creating budget:', error);
      throw error;
    }
  }

  /**
   * Find budget by ID
   * @param {number} id - Budget ID
   * @returns {Promise<Object|null>} - Budget object or null
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM budgets WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Error finding budget by ID:', error);
      throw error;
    }
  }

  /**
   * Find budget by entity
   * @param {number} userId - User ID
   * @param {string} entityType - Entity type ('line', 'department', 'company')
   * @param {number|null} entityId - Entity ID
   * @returns {Promise<Object|null>} - Budget object or null
   */
  static async findByEntity(userId, entityType, entityId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM budgets WHERE user_id = ? AND entity_type = ? AND entity_id = ?',
        [userId, entityType, entityId]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Error finding budget by entity:', error);
      throw error;
    }
  }

  /**
   * Get all budgets for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Array of budgets
   */
  static async findAllByUser(userId, options = {}) {
    try {
      let query = 'SELECT * FROM budgets WHERE user_id = ?';
      const queryParams = [userId];

      // Add entity type filter
      if (options.entityType) {
        query += ' AND entity_type = ?';
        queryParams.push(options.entityType);
      }

      // Add period filter
      if (options.period) {
        query += ' AND period = ?';
        queryParams.push(options.period);
      }

      // Add sorting
      query += ' ORDER BY created_at DESC';

      // Execute query
      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      logger.error('Error finding budgets by user:', error);
      throw error;
    }
  }

  /**
   * Update budget
   * @param {number} id - Budget ID
   * @param {Object} budgetData - Updated budget data
   * @returns {Promise<Object>} - Updated budget
   */
  static async update(id, budgetData) {
    try {
      const updateFields = [];
      const updateValues = [];

      // Build dynamic update query
      if (budgetData.entity_name !== undefined) {
        updateFields.push('entity_name = ?');
        updateValues.push(budgetData.entity_name);
      }
      if (budgetData.amount !== undefined) {
        updateFields.push('amount = ?');
        updateValues.push(budgetData.amount);
      }
      if (budgetData.period !== undefined) {
        updateFields.push('period = ?');
        updateValues.push(budgetData.period);
      }
      if (budgetData.currency !== undefined) {
        updateFields.push('currency = ?');
        updateValues.push(budgetData.currency);
      }
      if (budgetData.alert_threshold !== undefined) {
        updateFields.push('alert_threshold = ?');
        updateValues.push(budgetData.alert_threshold);
      }
      if (budgetData.start_date !== undefined) {
        updateFields.push('start_date = ?');
        updateValues.push(budgetData.start_date);
      }
      if (budgetData.end_date !== undefined) {
        updateFields.push('end_date = ?');
        updateValues.push(budgetData.end_date);
      }

      // Add ID to values
      updateValues.push(id);

      // Execute update query
      await pool.execute(
        `UPDATE budgets SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        updateValues
      );

      // Get updated budget
      const [budget] = await pool.execute('SELECT * FROM budgets WHERE id = ?', [id]);
      return budget[0];
    } catch (error) {
      logger.error('Error updating budget:', error);
      throw error;
    }
  }

  /**
   * Delete budget
   * @param {number} id - Budget ID
   * @returns {Promise<boolean>} - True if deleted
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM budgets WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Error deleting budget:', error);
      throw error;
    }
  }

  /**
   * Check if spending exceeds threshold
   * @param {number} userId - User ID
   * @returns {Promise<Array>} - Array of exceeded budgets
   */
  static async checkThresholds(userId) {
    try {
      // Get all active budgets for user
      const [budgets] = await pool.execute(
        `SELECT * FROM budgets 
         WHERE user_id = ? 
         AND (end_date IS NULL OR end_date >= CURDATE())`,
        [userId]
      );

      const exceededBudgets = [];

      // Check each budget against current spending
      for (const budget of budgets) {
        const currentSpending = await this.getCurrentSpending(
          userId,
          budget.entity_type,
          budget.entity_id,
          budget.period
        );

        const spendingPercentage = (currentSpending / budget.amount) * 100;

        // Check if threshold is exceeded
        if (spendingPercentage >= budget.alert_threshold) {
          exceededBudgets.push({
            budget,
            currentSpending,
            spendingPercentage
          });
        }
      }

      return exceededBudgets;
    } catch (error) {
      logger.error('Error checking thresholds:', error);
      throw error;
    }
  }

  /**
   * Get current spending for an entity
   * @param {number} userId - User ID
   * @param {string} entityType - Entity type
   * @param {number|null} entityId - Entity ID
   * @param {string} period - Period ('monthly', 'quarterly', 'yearly')
   * @returns {Promise<number>} - Current spending
   */
  static async getCurrentSpending(userId, entityType, entityId, period) {
    try {
      let dateFilter;
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Set date filter based on period
      switch (period) {
        case 'monthly':
          dateFilter = `YEAR(date) = ${year} AND MONTH(date) = ${month}`;
          break;
        case 'quarterly':
          const quarter = Math.floor((month - 1) / 3) + 1;
          const startMonth = (quarter - 1) * 3 + 1;
          const endMonth = quarter * 3;
          dateFilter = `YEAR(date) = ${year} AND MONTH(date) BETWEEN ${startMonth} AND ${endMonth}`;
          break;
        case 'yearly':
          dateFilter = `YEAR(date) = ${year}`;
          break;
        default:
          dateFilter = `YEAR(date) = ${year} AND MONTH(date) = ${month}`;
      }

      let query;
      let queryParams;

      // Build query based on entity type
      if (entityType === 'line') {
        query = `
          SELECT SUM(cost) as total_cost
          FROM usage_history
          JOIN telecom_lines ON usage_history.line_id = telecom_lines.id
          WHERE telecom_lines.user_id = ?
          AND telecom_lines.id = ?
          AND ${dateFilter}
        `;
        queryParams = [userId, entityId];
      } else if (entityType === 'department') {
        query = `
          SELECT SUM(cost) as total_cost
          FROM usage_history
          JOIN telecom_lines ON usage_history.line_id = telecom_lines.id
          WHERE telecom_lines.user_id = ?
          AND telecom_lines.department = ?
          AND ${dateFilter}
        `;
        queryParams = [userId, entityId];
      } else if (entityType === 'company') {
        query = `
          SELECT SUM(cost) as total_cost
          FROM usage_history
          JOIN telecom_lines ON usage_history.line_id = telecom_lines.id
          WHERE telecom_lines.user_id = ?
          AND ${dateFilter}
        `;
        queryParams = [userId];
      } else {
        throw new Error('Invalid entity type');
      }

      // Execute query
      const [rows] = await pool.execute(query, queryParams);
      return rows[0].total_cost || 0;
    } catch (error) {
      logger.error('Error getting current spending:', error);
      throw error;
    }
  }

  /**
   * Get spending summary for a user
   * @param {number} userId - User ID
   * @param {string} period - Period ('monthly', 'quarterly', 'yearly')
   * @returns {Promise<Object>} - Spending summary
   */
  static async getSpendingSummary(userId, period = 'monthly') {
    try {
      // Get all budgets
      const budgets = await this.findAllByUser(userId, { period });

      // Get spending for each budget
      const summary = {
        totalBudget: 0,
        totalSpending: 0,
        budgets: []
      };

      for (const budget of budgets) {
        const currentSpending = await this.getCurrentSpending(
          userId,
          budget.entity_type,
          budget.entity_id,
          budget.period
        );

        const spendingPercentage = budget.amount > 0 ? (currentSpending / budget.amount) * 100 : 0;

        summary.totalBudget += budget.amount;
        summary.totalSpending += currentSpending;

        summary.budgets.push({
          id: budget.id,
          entityType: budget.entity_type,
          entityName: budget.entity_name,
          budget: budget.amount,
          spending: currentSpending,
          percentage: spendingPercentage,
          currency: budget.currency,
          alertThreshold: budget.alert_threshold
        });
      }

      // Calculate overall percentage
      summary.overallPercentage = summary.totalBudget > 0 
        ? (summary.totalSpending / summary.totalBudget) * 100 
        : 0;

      return summary;
    } catch (error) {
      logger.error('Error getting spending summary:', error);
      throw error;
    }
  }
}

module.exports = Budget;
