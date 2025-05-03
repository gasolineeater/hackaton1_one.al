const { pool } = require('../config/db.config');

/**
 * Usage History Model
 */
class UsageHistory {
  constructor(history) {
    this.id = history.id;
    this.line_id = history.line_id;
    this.month = history.month;
    this.year = history.year;
    this.data_usage = history.data_usage;
    this.calls_usage = history.calls_usage;
    this.sms_usage = history.sms_usage;
    this.created_at = history.created_at;
    this.updated_at = history.updated_at;
  }

  /**
   * Create a new usage history record
   * @param {Object} newHistory - Usage history object
   * @returns {Promise} - Created usage history record
   */
  static async create(newHistory) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO usage_history (line_id, month, year, data_usage, calls_usage, sms_usage) VALUES (?, ?, ?, ?, ?, ?)',
        [
          newHistory.line_id,
          newHistory.month,
          newHistory.year,
          newHistory.data_usage || 0,
          newHistory.calls_usage || 0,
          newHistory.sms_usage || 0
        ]
      );

      const [history] = await pool.execute('SELECT * FROM usage_history WHERE id = ?', [result.insertId]);
      return history[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find usage history by ID
   * @param {number} id - Usage history ID
   * @returns {Promise} - Usage history object
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM usage_history WHERE id = ?', [id]);
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get usage history for a telecom line
   * @param {number} lineId - Telecom line ID
   * @param {Object} options - Query options (limit, offset, startDate, endDate)
   * @returns {Promise} - Array of usage history records
   */
  static async findByLineId(lineId, options = {}) {
    try {
      let query = 'SELECT * FROM usage_history WHERE line_id = ?';
      const queryParams = [lineId];
      
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
      query += ' ORDER BY year DESC, month DESC';
      
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
   * Get usage history for a user (across all lines)
   * @param {number} userId - User ID
   * @param {Object} options - Query options (limit, offset, startDate, endDate)
   * @returns {Promise} - Array of usage history records with line information
   */
  static async findByUserId(userId, options = {}) {
    try {
      let query = `
        SELECT uh.*, tl.phone_number, tl.assigned_to, tl.monthly_limit
        FROM usage_history uh
        JOIN telecom_lines tl ON uh.line_id = tl.id
        WHERE tl.user_id = ?
      `;
      const queryParams = [userId];
      
      // Add date range filter if provided
      if (options.startYear && options.startMonth) {
        query += ' AND (uh.year > ? OR (uh.year = ? AND uh.month >= ?))';
        queryParams.push(options.startYear, options.startYear, options.startMonth);
      }
      
      if (options.endYear && options.endMonth) {
        query += ' AND (uh.year < ? OR (uh.year = ? AND uh.month <= ?))';
        queryParams.push(options.endYear, options.endYear, options.endMonth);
      }
      
      // Add line filter if provided
      if (options.lineId) {
        query += ' AND uh.line_id = ?';
        queryParams.push(options.lineId);
      }
      
      // Add sorting
      query += ' ORDER BY uh.year DESC, uh.month DESC';
      
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
   * Update usage history record
   * @param {number} id - Usage history ID
   * @param {Object} history - Usage history object with updated fields
   * @returns {Promise} - Updated usage history record
   */
  static async update(id, history) {
    try {
      let query = 'UPDATE usage_history SET ';
      const values = [];
      const fields = [];

      if (history.month) {
        fields.push('month = ?');
        values.push(history.month);
      }

      if (history.year) {
        fields.push('year = ?');
        values.push(history.year);
      }

      if (history.data_usage !== undefined) {
        fields.push('data_usage = ?');
        values.push(history.data_usage);
      }

      if (history.calls_usage !== undefined) {
        fields.push('calls_usage = ?');
        values.push(history.calls_usage);
      }

      if (history.sms_usage !== undefined) {
        fields.push('sms_usage = ?');
        values.push(history.sms_usage);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      query += fields.join(', ');
      query += ' WHERE id = ?';
      values.push(id);

      await pool.execute(query, values);
      
      const [updatedHistory] = await pool.execute('SELECT * FROM usage_history WHERE id = ?', [id]);
      return updatedHistory[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete usage history record
   * @param {number} id - Usage history ID
   * @returns {Promise} - Boolean indicating success
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM usage_history WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get aggregated usage data for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (groupBy, startDate, endDate)
   * @returns {Promise} - Aggregated usage data
   */
  static async getAggregatedUsage(userId, options = {}) {
    try {
      // Determine grouping (month, quarter, year)
      const groupBy = options.groupBy || 'month';
      
      let selectClause, groupByClause;
      
      if (groupBy === 'month') {
        selectClause = 'uh.year, uh.month';
        groupByClause = 'uh.year, uh.month';
      } else if (groupBy === 'quarter') {
        selectClause = 'uh.year, CEIL(FIELD(uh.month, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec") / 3) as quarter';
        groupByClause = 'uh.year, quarter';
      } else if (groupBy === 'year') {
        selectClause = 'uh.year';
        groupByClause = 'uh.year';
      } else {
        throw new Error('Invalid groupBy option');
      }
      
      let query = `
        SELECT ${selectClause}, 
          SUM(uh.data_usage) as total_data_usage,
          SUM(uh.calls_usage) as total_calls_usage,
          SUM(uh.sms_usage) as total_sms_usage,
          COUNT(DISTINCT uh.line_id) as line_count
        FROM usage_history uh
        JOIN telecom_lines tl ON uh.line_id = tl.id
        WHERE tl.user_id = ?
      `;
      
      const queryParams = [userId];
      
      // Add date range filter if provided
      if (options.startYear && options.startMonth) {
        query += ' AND (uh.year > ? OR (uh.year = ? AND uh.month >= ?))';
        queryParams.push(options.startYear, options.startYear, options.startMonth);
      }
      
      if (options.endYear && options.endMonth) {
        query += ' AND (uh.year < ? OR (uh.year = ? AND uh.month <= ?))';
        queryParams.push(options.endYear, options.endYear, options.endMonth);
      }
      
      // Add line filter if provided
      if (options.lineId) {
        query += ' AND uh.line_id = ?';
        queryParams.push(options.lineId);
      }
      
      // Add grouping
      query += ` GROUP BY ${groupByClause}`;
      
      // Add sorting
      if (groupBy === 'month') {
        query += ' ORDER BY uh.year DESC, FIELD(uh.month, "Dec", "Nov", "Oct", "Sep", "Aug", "Jul", "Jun", "May", "Apr", "Mar", "Feb", "Jan")';
      } else if (groupBy === 'quarter') {
        query += ' ORDER BY uh.year DESC, quarter DESC';
      } else {
        query += ' ORDER BY uh.year DESC';
      }
      
      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate sample usage history for a line
   * @param {number} lineId - Telecom line ID
   * @param {number} months - Number of months to generate
   * @returns {Promise} - Array of created usage history records
   */
  static async generateSampleData(lineId, months = 6) {
    try {
      // Get line details
      const [lineRows] = await pool.execute('SELECT * FROM telecom_lines WHERE id = ?', [lineId]);
      
      if (lineRows.length === 0) {
        throw new Error('Line not found');
      }
      
      const line = lineRows[0];
      
      // Get current date
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 0-11
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const createdRecords = [];
      
      // Generate data for each month
      for (let i = 0; i < months; i++) {
        // Calculate month and year
        let targetMonth = currentMonth - i;
        let targetYear = currentYear;
        
        // Handle previous year
        if (targetMonth < 0) {
          targetMonth += 12;
          targetYear--;
        }
        
        const monthName = monthNames[targetMonth];
        
        // Generate random usage data with some trend
        const baseDataUsage = line.monthly_limit * 0.6; // Base at 60% of limit
        const randomFactor = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
        const trendFactor = 1 + (i * 0.05); // Slight increasing trend for older months
        
        const dataUsage = baseDataUsage * randomFactor / trendFactor;
        const callsUsage = 100 * randomFactor / trendFactor; // Assuming minutes
        const smsUsage = 50 * randomFactor / trendFactor; // Assuming count
        
        // Create usage history record
        const newHistory = {
          line_id: lineId,
          month: monthName,
          year: targetYear,
          data_usage: parseFloat(dataUsage.toFixed(2)),
          calls_usage: parseFloat(callsUsage.toFixed(2)),
          sms_usage: parseFloat(smsUsage.toFixed(2))
        };
        
        // Check if record already exists
        const [existingRows] = await pool.execute(
          'SELECT * FROM usage_history WHERE line_id = ? AND month = ? AND year = ?',
          [lineId, monthName, targetYear]
        );
        
        if (existingRows.length === 0) {
          const createdRecord = await this.create(newHistory);
          createdRecords.push(createdRecord);
        }
      }
      
      return createdRecords;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UsageHistory;
