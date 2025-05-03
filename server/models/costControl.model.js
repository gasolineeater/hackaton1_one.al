const { pool } = require('../config/db.config');

/**
 * Cost Control Model
 * Provides methods for managing budgets and cost alerts
 */
class CostControl {
  /**
   * Get budget for a user
   * @param {number} userId - User ID
   * @param {string} month - Month (Jan, Feb, etc.)
   * @param {number} year - Year
   * @returns {Promise} - Budget data
   */
  static async getBudget(userId, month, year) {
    try {
      // Check if budget exists
      const [rows] = await pool.execute(
        'SELECT * FROM cost_breakdown WHERE user_id = ? AND month = ? AND year = ?',
        [userId, month, year]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set budget for a user
   * @param {number} userId - User ID
   * @param {string} month - Month (Jan, Feb, etc.)
   * @param {number} year - Year
   * @param {Object} budgetData - Budget data
   * @returns {Promise} - Updated budget data
   */
  static async setBudget(userId, month, year, budgetData) {
    try {
      // Check if budget exists
      const [existingRows] = await pool.execute(
        'SELECT * FROM cost_breakdown WHERE user_id = ? AND month = ? AND year = ?',
        [userId, month, year]
      );
      
      if (existingRows.length === 0) {
        // Create new budget
        const [result] = await pool.execute(
          `INSERT INTO cost_breakdown 
            (user_id, month, year, data_cost, calls_cost, sms_cost, roaming_cost, other_cost, total_cost) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId, 
            month, 
            year, 
            budgetData.data_cost || 0,
            budgetData.calls_cost || 0,
            budgetData.sms_cost || 0,
            budgetData.roaming_cost || 0,
            budgetData.other_cost || 0,
            budgetData.total_cost || 0
          ]
        );
        
        const [newBudget] = await pool.execute('SELECT * FROM cost_breakdown WHERE id = ?', [result.insertId]);
        return newBudget[0];
      } else {
        // Update existing budget
        const existingBudget = existingRows[0];
        
        const [result] = await pool.execute(
          `UPDATE cost_breakdown SET 
            data_cost = ?, 
            calls_cost = ?, 
            sms_cost = ?, 
            roaming_cost = ?, 
            other_cost = ?, 
            total_cost = ?
           WHERE id = ?`,
          [
            budgetData.data_cost !== undefined ? budgetData.data_cost : existingBudget.data_cost,
            budgetData.calls_cost !== undefined ? budgetData.calls_cost : existingBudget.calls_cost,
            budgetData.sms_cost !== undefined ? budgetData.sms_cost : existingBudget.sms_cost,
            budgetData.roaming_cost !== undefined ? budgetData.roaming_cost : existingBudget.roaming_cost,
            budgetData.other_cost !== undefined ? budgetData.other_cost : existingBudget.other_cost,
            budgetData.total_cost !== undefined ? budgetData.total_cost : existingBudget.total_cost,
            existingBudget.id
          ]
        );
        
        const [updatedBudget] = await pool.execute('SELECT * FROM cost_breakdown WHERE id = ?', [existingBudget.id]);
        return updatedBudget[0];
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all budgets for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (limit, offset, startYear, startMonth, endYear, endMonth)
   * @returns {Promise} - Array of budget data
   */
  static async getAllBudgets(userId, options = {}) {
    try {
      let query = 'SELECT * FROM cost_breakdown WHERE user_id = ?';
      const queryParams = [userId];
      
      // Add date range filter if provided
      if (options.startYear && options.startMonth) {
        query += ' AND (year > ? OR (year = ? AND month >= ?))';
        queryParams.push(options.startYear, options.startYear, options.startMonth);
      }
      
      if (options.endYear && options.endMonth) {
        query += ' AND (year < ? OR (year = ? AND month <= ?))';
        queryParams.push(options.endYear, options.endYear, options.endMonth);
      }
      
      // Add sorting
      query += ' ORDER BY year DESC, FIELD(month, "Dec", "Nov", "Oct", "Sep", "Aug", "Jul", "Jun", "May", "Apr", "Mar", "Feb", "Jan")';
      
      // Add pagination
      if (options.limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(options.limit));
        
        if (options.offset) {
          query += ' OFFSET ?';
          queryParams.push(parseInt(options.offset));
        }
      }
      
      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cost alerts for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Array of cost alerts
   */
  static async getCostAlerts(userId) {
    try {
      // Get current month and year
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11
      const currentYear = now.getFullYear();
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonthName = monthNames[currentMonth];
      
      // Get current month's budget
      const [budgetRows] = await pool.execute(
        'SELECT * FROM cost_breakdown WHERE user_id = ? AND month = ? AND year = ?',
        [userId, currentMonthName, currentYear]
      );
      
      if (budgetRows.length === 0) {
        return [];
      }
      
      const budget = budgetRows[0];
      
      // Get all telecom lines for the user
      const [lines] = await pool.execute(`
        SELECT tl.*, sp.price
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        WHERE tl.user_id = ?
      `, [userId]);
      
      // Calculate current month's usage
      const [usageRows] = await pool.execute(`
        SELECT 
          SUM(uh.data_usage) as total_data,
          COUNT(DISTINCT uh.line_id) as line_count
        FROM usage_history uh
        JOIN telecom_lines tl ON uh.line_id = tl.id
        WHERE tl.user_id = ? AND uh.month = ? AND uh.year = ?
      `, [userId, currentMonthName, currentYear]);
      
      const usage = usageRows[0];
      
      // Calculate total cost based on lines and usage
      const baseCost = lines.reduce((sum, line) => sum + line.price, 0);
      
      // Generate alerts
      const alerts = [];
      
      // Alert 1: Total cost approaching budget
      if (baseCost > budget.total_cost * 0.8) {
        alerts.push({
          type: 'budget',
          severity: baseCost > budget.total_cost ? 'high' : 'medium',
          message: `Your current spending (€${baseCost.toFixed(2)}) is ${baseCost > budget.total_cost ? 'exceeding' : 'approaching'} your monthly budget of €${budget.total_cost.toFixed(2)}.`,
          details: {
            currentCost: baseCost,
            budgetAmount: budget.total_cost,
            percentage: (baseCost / budget.total_cost) * 100
          }
        });
      }
      
      // Alert 2: High data usage
      if (usage.total_data) {
        // Calculate average data limit across all lines
        const totalDataLimit = lines.reduce((sum, line) => sum + line.monthly_limit, 0);
        
        if (usage.total_data > totalDataLimit * 0.8) {
          alerts.push({
            type: 'data_usage',
            severity: usage.total_data > totalDataLimit ? 'high' : 'medium',
            message: `Your data usage (${usage.total_data.toFixed(2)} GB) is ${usage.total_data > totalDataLimit ? 'exceeding' : 'approaching'} your total data limit of ${totalDataLimit.toFixed(2)} GB.`,
            details: {
              currentUsage: usage.total_data,
              totalLimit: totalDataLimit,
              percentage: (usage.total_data / totalDataLimit) * 100
            }
          });
        }
      }
      
      // Alert 3: Lines with high individual usage
      const highUsageLines = [];
      
      for (const line of lines) {
        const [lineUsageRows] = await pool.execute(`
          SELECT SUM(data_usage) as line_data_usage
          FROM usage_history
          WHERE line_id = ? AND month = ? AND year = ?
        `, [line.id, currentMonthName, currentYear]);
        
        if (lineUsageRows[0].line_data_usage && lineUsageRows[0].line_data_usage > line.monthly_limit * 0.9) {
          highUsageLines.push({
            id: line.id,
            phoneNumber: line.phone_number,
            assignedTo: line.assigned_to,
            usage: lineUsageRows[0].line_data_usage,
            limit: line.monthly_limit,
            percentage: (lineUsageRows[0].line_data_usage / line.monthly_limit) * 100
          });
        }
      }
      
      if (highUsageLines.length > 0) {
        alerts.push({
          type: 'high_usage_lines',
          severity: 'medium',
          message: `${highUsageLines.length} line(s) have high data usage (>90% of limit).`,
          details: {
            lineCount: highUsageLines.length,
            lines: highUsageLines
          }
        });
      }
      
      return alerts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set budget alert threshold for a user
   * @param {number} userId - User ID
   * @param {number} threshold - Alert threshold percentage (0-100)
   * @returns {Promise} - Updated user settings
   */
  static async setBudgetAlertThreshold(userId, threshold) {
    try {
      // Check if user settings exist
      const [settingsRows] = await pool.execute(
        'SELECT * FROM user_settings WHERE user_id = ?',
        [userId]
      );
      
      if (settingsRows.length === 0) {
        // Create new settings
        const [result] = await pool.execute(
          'INSERT INTO user_settings (user_id, budget_alert_threshold) VALUES (?, ?)',
          [userId, threshold]
        );
        
        const [newSettings] = await pool.execute('SELECT * FROM user_settings WHERE id = ?', [result.insertId]);
        return newSettings[0];
      } else {
        // Update existing settings
        const existingSettings = settingsRows[0];
        
        await pool.execute(
          'UPDATE user_settings SET budget_alert_threshold = ? WHERE id = ?',
          [threshold, existingSettings.id]
        );
        
        const [updatedSettings] = await pool.execute('SELECT * FROM user_settings WHERE id = ?', [existingSettings.id]);
        return updatedSettings[0];
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get budget alert threshold for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Alert threshold percentage
   */
  static async getBudgetAlertThreshold(userId) {
    try {
      // Check if user settings exist
      const [settingsRows] = await pool.execute(
        'SELECT * FROM user_settings WHERE user_id = ?',
        [userId]
      );
      
      if (settingsRows.length === 0) {
        // Return default threshold
        return 80;
      } else {
        // Return existing threshold
        return settingsRows[0].budget_alert_threshold;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CostControl;
