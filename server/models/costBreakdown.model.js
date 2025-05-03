/**
 * Cost Breakdown Model
 * Manages cost analytics and reporting
 */

const { pool } = require('../config/db.config');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

class CostBreakdown {
  constructor(costBreakdown) {
    this.id = costBreakdown.id;
    this.user_id = costBreakdown.user_id;
    this.month = costBreakdown.month;
    this.year = costBreakdown.year;
    this.total_cost = costBreakdown.total_cost;
    this.data_cost = costBreakdown.data_cost;
    this.calls_cost = costBreakdown.calls_cost;
    this.sms_cost = costBreakdown.sms_cost;
    this.other_cost = costBreakdown.other_cost;
    this.created_at = costBreakdown.created_at;
    this.updated_at = costBreakdown.updated_at;
  }

  /**
   * Create a new cost breakdown
   * @param {Object} costData - Cost breakdown data
   * @returns {Promise<Object>} - Created cost breakdown
   */
  static async create(costData) {
    try {
      // Check if cost breakdown already exists for this month/year
      const existingBreakdown = await this.findByMonthYear(
        costData.user_id,
        costData.month,
        costData.year
      );

      if (existingBreakdown) {
        // Update existing breakdown instead of creating a new one
        return await this.update(existingBreakdown.id, costData);
      }

      const [result] = await pool.execute(
        `INSERT INTO cost_breakdown (
          user_id, month, year, total_cost, data_cost, 
          calls_cost, sms_cost, other_cost
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          costData.user_id,
          costData.month,
          costData.year,
          costData.total_cost,
          costData.data_cost,
          costData.calls_cost,
          costData.sms_cost,
          costData.other_cost
        ]
      );

      const [breakdown] = await pool.execute('SELECT * FROM cost_breakdown WHERE id = ?', [result.insertId]);
      return breakdown[0];
    } catch (error) {
      logger.error('Error creating cost breakdown:', error);
      throw error;
    }
  }

  /**
   * Find cost breakdown by ID
   * @param {number} id - Cost breakdown ID
   * @returns {Promise<Object|null>} - Cost breakdown object or null
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM cost_breakdown WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Error finding cost breakdown by ID:', error);
      throw error;
    }
  }

  /**
   * Find cost breakdown by month and year
   * @param {number} userId - User ID
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise<Object|null>} - Cost breakdown object or null
   */
  static async findByMonthYear(userId, month, year) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM cost_breakdown WHERE user_id = ? AND month = ? AND year = ?',
        [userId, month, year]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Error finding cost breakdown by month/year:', error);
      throw error;
    }
  }

  /**
   * Get all cost breakdowns for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Array of cost breakdowns
   */
  static async findAllByUser(userId, options = {}) {
    try {
      let query = 'SELECT * FROM cost_breakdown WHERE user_id = ?';
      const queryParams = [userId];

      // Add year filter
      if (options.year) {
        query += ' AND year = ?';
        queryParams.push(options.year);
      }

      // Add month filter
      if (options.month) {
        query += ' AND month = ?';
        queryParams.push(options.month);
      }

      // Add sorting
      query += ' ORDER BY year DESC, month DESC';

      // Add limit and offset
      if (options.limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(options.limit));

        if (options.offset) {
          query += ' OFFSET ?';
          queryParams.push(parseInt(options.offset));
        }
      }

      // Execute query
      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      logger.error('Error finding cost breakdowns by user:', error);
      throw error;
    }
  }

  /**
   * Update cost breakdown
   * @param {number} id - Cost breakdown ID
   * @param {Object} costData - Updated cost data
   * @returns {Promise<Object>} - Updated cost breakdown
   */
  static async update(id, costData) {
    try {
      const updateFields = [];
      const updateValues = [];

      // Build dynamic update query
      if (costData.total_cost !== undefined) {
        updateFields.push('total_cost = ?');
        updateValues.push(costData.total_cost);
      }
      if (costData.data_cost !== undefined) {
        updateFields.push('data_cost = ?');
        updateValues.push(costData.data_cost);
      }
      if (costData.calls_cost !== undefined) {
        updateFields.push('calls_cost = ?');
        updateValues.push(costData.calls_cost);
      }
      if (costData.sms_cost !== undefined) {
        updateFields.push('sms_cost = ?');
        updateValues.push(costData.sms_cost);
      }
      if (costData.other_cost !== undefined) {
        updateFields.push('other_cost = ?');
        updateValues.push(costData.other_cost);
      }

      // Add ID to values
      updateValues.push(id);

      // Execute update query
      await pool.execute(
        `UPDATE cost_breakdown SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
        updateValues
      );

      // Get updated cost breakdown
      const [breakdown] = await pool.execute('SELECT * FROM cost_breakdown WHERE id = ?', [id]);
      return breakdown[0];
    } catch (error) {
      logger.error('Error updating cost breakdown:', error);
      throw error;
    }
  }

  /**
   * Delete cost breakdown
   * @param {number} id - Cost breakdown ID
   * @returns {Promise<boolean>} - True if deleted
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM cost_breakdown WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Error deleting cost breakdown:', error);
      throw error;
    }
  }

  /**
   * Generate cost breakdown for a specific month
   * @param {number} userId - User ID
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise<Object>} - Generated cost breakdown
   */
  static async generateForMonth(userId, month, year) {
    try {
      // Get start and end dates for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Format dates for SQL
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Get usage data for the month
      const [usageData] = await pool.execute(
        `SELECT 
          SUM(data_cost) as data_cost,
          SUM(calls_cost) as calls_cost,
          SUM(sms_cost) as sms_cost,
          SUM(other_cost) as other_cost,
          SUM(data_cost + calls_cost + sms_cost + other_cost) as total_cost
        FROM usage_history
        JOIN telecom_lines ON usage_history.line_id = telecom_lines.id
        WHERE telecom_lines.user_id = ?
        AND usage_history.date BETWEEN ? AND ?`,
        [userId, startDateStr, endDateStr]
      );

      // Create or update cost breakdown
      const costData = {
        user_id: userId,
        month,
        year,
        total_cost: usageData[0].total_cost || 0,
        data_cost: usageData[0].data_cost || 0,
        calls_cost: usageData[0].calls_cost || 0,
        sms_cost: usageData[0].sms_cost || 0,
        other_cost: usageData[0].other_cost || 0
      };

      return await this.create(costData);
    } catch (error) {
      logger.error('Error generating cost breakdown:', error);
      throw error;
    }
  }

  /**
   * Get cost trends for a user
   * @param {number} userId - User ID
   * @param {number} months - Number of months to include
   * @returns {Promise<Array>} - Cost trend data
   */
  static async getCostTrends(userId, months = 12) {
    try {
      // Get current date
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      // Calculate start date
      const startMonth = currentMonth - months + 1;
      const startYear = currentYear + Math.floor((startMonth - 1) / 12);
      const adjustedStartMonth = ((startMonth - 1) % 12) + 1;

      // Get cost breakdowns for the period
      const [rows] = await pool.execute(
        `SELECT * FROM cost_breakdown 
         WHERE user_id = ? 
         AND ((year = ? AND month >= ?) OR (year > ?))
         AND ((year = ? AND month <= ?) OR (year < ?))
         ORDER BY year ASC, month ASC`,
        [userId, startYear, adjustedStartMonth, startYear, currentYear, currentMonth, currentYear]
      );

      // Fill in missing months with zeros
      const trends = [];
      let currentDate = new Date(startYear, adjustedStartMonth - 1, 1);
      const endDate = new Date(currentYear, currentMonth - 1, 1);

      while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        // Find existing breakdown for this month
        const existingBreakdown = rows.find(
          row => row.year === year && row.month === month
        );

        if (existingBreakdown) {
          trends.push(existingBreakdown);
        } else {
          // Create empty breakdown for this month
          trends.push({
            user_id: userId,
            month,
            year,
            total_cost: 0,
            data_cost: 0,
            calls_cost: 0,
            sms_cost: 0,
            other_cost: 0
          });
        }

        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return trends;
    } catch (error) {
      logger.error('Error getting cost trends:', error);
      throw error;
    }
  }

  /**
   * Get cost breakdown by category
   * @param {number} userId - User ID
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise<Object>} - Cost breakdown by category
   */
  static async getCostByCategory(userId, month, year) {
    try {
      // Get cost breakdown for the month
      const breakdown = await this.findByMonthYear(userId, month, year);

      if (!breakdown) {
        // Generate breakdown if it doesn't exist
        return await this.generateForMonth(userId, month, year);
      }

      return breakdown;
    } catch (error) {
      logger.error('Error getting cost by category:', error);
      throw error;
    }
  }

  /**
   * Get cost breakdown by line
   * @param {number} userId - User ID
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise<Array>} - Cost breakdown by line
   */
  static async getCostByLine(userId, month, year) {
    try {
      // Get start and end dates for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Format dates for SQL
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Get usage data by line
      const [rows] = await pool.execute(
        `SELECT 
          telecom_lines.id as line_id,
          telecom_lines.phone_number,
          telecom_lines.assigned_to,
          SUM(data_cost) as data_cost,
          SUM(calls_cost) as calls_cost,
          SUM(sms_cost) as sms_cost,
          SUM(other_cost) as other_cost,
          SUM(data_cost + calls_cost + sms_cost + other_cost) as total_cost
        FROM usage_history
        JOIN telecom_lines ON usage_history.line_id = telecom_lines.id
        WHERE telecom_lines.user_id = ?
        AND usage_history.date BETWEEN ? AND ?
        GROUP BY telecom_lines.id
        ORDER BY total_cost DESC`,
        [userId, startDateStr, endDateStr]
      );

      return rows;
    } catch (error) {
      logger.error('Error getting cost by line:', error);
      throw error;
    }
  }

  /**
   * Get cost breakdown by department
   * @param {number} userId - User ID
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise<Array>} - Cost breakdown by department
   */
  static async getCostByDepartment(userId, month, year) {
    try {
      // Get start and end dates for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Format dates for SQL
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Get usage data by department
      const [rows] = await pool.execute(
        `SELECT 
          telecom_lines.department,
          COUNT(DISTINCT telecom_lines.id) as line_count,
          SUM(data_cost) as data_cost,
          SUM(calls_cost) as calls_cost,
          SUM(sms_cost) as sms_cost,
          SUM(other_cost) as other_cost,
          SUM(data_cost + calls_cost + sms_cost + other_cost) as total_cost
        FROM usage_history
        JOIN telecom_lines ON usage_history.line_id = telecom_lines.id
        WHERE telecom_lines.user_id = ?
        AND usage_history.date BETWEEN ? AND ?
        GROUP BY telecom_lines.department
        ORDER BY total_cost DESC`,
        [userId, startDateStr, endDateStr]
      );

      return rows;
    } catch (error) {
      logger.error('Error getting cost by department:', error);
      throw error;
    }
  }

  /**
   * Export financial report
   * @param {number} userId - User ID
   * @param {string} format - Export format ('csv', 'json')
   * @param {Object} options - Export options
   * @returns {Promise<string>} - Path to exported file
   */
  static async exportFinancialReport(userId, format = 'csv', options = {}) {
    try {
      // Get cost data
      let costData;
      
      if (options.type === 'line') {
        costData = await this.getCostByLine(userId, options.month, options.year);
      } else if (options.type === 'department') {
        costData = await this.getCostByDepartment(userId, options.month, options.year);
      } else {
        // Get monthly breakdowns for the year
        costData = await this.findAllByUser(userId, { year: options.year });
      }

      // Create exports directory if it doesn't exist
      const exportsDir = path.join(__dirname, '../../exports');
      await mkdirAsync(exportsDir, { recursive: true });

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `financial_report_${options.type || 'monthly'}_${options.year}_${options.month || ''}_${timestamp}.${format}`;
      const filePath = path.join(exportsDir, filename);

      // Export data in requested format
      if (format === 'csv') {
        await this.exportToCsv(costData, filePath, options.type);
      } else if (format === 'json') {
        await this.exportToJson(costData, filePath);
      } else {
        throw new Error('Unsupported export format');
      }

      return filePath;
    } catch (error) {
      logger.error('Error exporting financial report:', error);
      throw error;
    }
  }

  /**
   * Export data to CSV
   * @param {Array} data - Data to export
   * @param {string} filePath - Path to export file
   * @param {string} type - Report type
   * @returns {Promise<void>}
   */
  static async exportToCsv(data, filePath, type) {
    try {
      let headers;
      let rows;

      // Format data based on report type
      if (type === 'line') {
        headers = ['Line ID', 'Phone Number', 'Assigned To', 'Data Cost', 'Calls Cost', 'SMS Cost', 'Other Cost', 'Total Cost'];
        rows = data.map(item => [
          item.line_id,
          item.phone_number,
          item.assigned_to,
          item.data_cost,
          item.calls_cost,
          item.sms_cost,
          item.other_cost,
          item.total_cost
        ]);
      } else if (type === 'department') {
        headers = ['Department', 'Line Count', 'Data Cost', 'Calls Cost', 'SMS Cost', 'Other Cost', 'Total Cost'];
        rows = data.map(item => [
          item.department,
          item.line_count,
          item.data_cost,
          item.calls_cost,
          item.sms_cost,
          item.other_cost,
          item.total_cost
        ]);
      } else {
        headers = ['Year', 'Month', 'Data Cost', 'Calls Cost', 'SMS Cost', 'Other Cost', 'Total Cost'];
        rows = data.map(item => [
          item.year,
          item.month,
          item.data_cost,
          item.calls_cost,
          item.sms_cost,
          item.other_cost,
          item.total_cost
        ]);
      }

      // Convert to CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Write to file
      await writeFileAsync(filePath, csvContent);
    } catch (error) {
      logger.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  /**
   * Export data to JSON
   * @param {Array} data - Data to export
   * @param {string} filePath - Path to export file
   * @returns {Promise<void>}
   */
  static async exportToJson(data, filePath) {
    try {
      // Write to file
      await writeFileAsync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      logger.error('Error exporting to JSON:', error);
      throw error;
    }
  }

  /**
   * Get cost optimization recommendations
   * @param {number} userId - User ID
   * @returns {Promise<Array>} - Cost optimization recommendations
   */
  static async getOptimizationRecommendations(userId) {
    try {
      const recommendations = [];

      // Get user's telecom lines
      const [lines] = await pool.execute(
        'SELECT * FROM telecom_lines WHERE user_id = ?',
        [userId]
      );

      // Get usage data for the last 3 months
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      const startDateStr = threeMonthsAgo.toISOString().split('T')[0];
      const endDateStr = now.toISOString().split('T')[0];

      // Check for lines with low data usage
      for (const line of lines) {
        const [usageData] = await pool.execute(
          `SELECT 
            AVG(data_used) as avg_data_used,
            MAX(data_used) as max_data_used
          FROM usage_history
          WHERE line_id = ?
          AND date BETWEEN ? AND ?`,
          [line.id, startDateStr, endDateStr]
        );

        const avgDataUsed = usageData[0].avg_data_used || 0;
        const maxDataUsed = usageData[0].max_data_used || 0;

        // Get line's plan
        const [planData] = await pool.execute(
          'SELECT * FROM service_plans WHERE id = ?',
          [line.plan_id]
        );

        if (planData.length > 0) {
          const plan = planData[0];
          const dataLimit = plan.data_limit;

          // Check if line consistently uses less than 50% of data limit
          if (maxDataUsed < dataLimit * 0.5) {
            recommendations.push({
              type: 'data_plan_downgrade',
              line_id: line.id,
              phone_number: line.phone_number,
              assigned_to: line.assigned_to,
              current_plan: plan.name,
              current_data_limit: dataLimit,
              avg_data_used: avgDataUsed,
              max_data_used: maxDataUsed,
              potential_savings: plan.price * 0.2, // Estimate 20% savings with lower plan
              message: `Line ${line.phone_number} (${line.assigned_to}) consistently uses less than 50% of its data limit. Consider downgrading to a lower data plan.`
            });
          }
        }
      }

      // Check for departments with high costs
      const [departmentCosts] = await pool.execute(
        `SELECT 
          telecom_lines.department,
          COUNT(DISTINCT telecom_lines.id) as line_count,
          SUM(usage_history.data_cost + usage_history.calls_cost + usage_history.sms_cost + usage_history.other_cost) as total_cost
        FROM usage_history
        JOIN telecom_lines ON usage_history.line_id = telecom_lines.id
        WHERE telecom_lines.user_id = ?
        AND usage_history.date BETWEEN ? AND ?
        GROUP BY telecom_lines.department
        ORDER BY total_cost DESC`,
        [userId, startDateStr, endDateStr]
      );

      // Check for departments with high cost per line
      for (const dept of departmentCosts) {
        if (dept.line_count > 1) {
          const costPerLine = dept.total_cost / dept.line_count;
          
          // If cost per line is high, suggest shared data plans
          if (costPerLine > 30) { // Threshold for high cost per line
            recommendations.push({
              type: 'shared_data_plan',
              department: dept.department,
              line_count: dept.line_count,
              total_cost: dept.total_cost,
              cost_per_line: costPerLine,
              potential_savings: dept.total_cost * 0.15, // Estimate 15% savings with shared plan
              message: `Department "${dept.department}" has a high cost per line (€${costPerLine.toFixed(2)}). Consider implementing a shared data plan for this department.`
            });
          }
        }
      }

      // Check for international calling patterns
      const [internationalCalls] = await pool.execute(
        `SELECT 
          telecom_lines.id as line_id,
          telecom_lines.phone_number,
          telecom_lines.assigned_to,
          SUM(usage_history.calls_cost) as international_calls_cost
        FROM usage_history
        JOIN telecom_lines ON usage_history.line_id = telecom_lines.id
        WHERE telecom_lines.user_id = ?
        AND usage_history.date BETWEEN ? AND ?
        AND usage_history.international_calls > 0
        GROUP BY telecom_lines.id
        HAVING international_calls_cost > 50
        ORDER BY international_calls_cost DESC`,
        [userId, startDateStr, endDateStr]
      );

      // Suggest international calling plans for lines with high international call costs
      for (const line of internationalCalls) {
        recommendations.push({
          type: 'international_calling_plan',
          line_id: line.line_id,
          phone_number: line.phone_number,
          assigned_to: line.assigned_to,
          international_calls_cost: line.international_calls_cost,
          potential_savings: line.international_calls_cost * 0.3, // Estimate 30% savings with international plan
          message: `Line ${line.phone_number} (${line.assigned_to}) has high international calling costs (€${line.international_calls_cost.toFixed(2)}). Consider adding an international calling package.`
        });
      }

      return recommendations;
    } catch (error) {
      logger.error('Error getting optimization recommendations:', error);
      throw error;
    }
  }
}

module.exports = CostBreakdown;
