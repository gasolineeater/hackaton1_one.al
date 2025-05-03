const { pool } = require('../config/db.config');

/**
 * Telecom Line Model
 */
class TelecomLine {
  constructor(line) {
    this.id = line.id;
    this.phone_number = line.phone_number;
    this.assigned_to = line.assigned_to;
    this.plan_id = line.plan_id;
    this.monthly_limit = line.monthly_limit;
    this.current_usage = line.current_usage;
    this.status = line.status || 'active';
    this.user_id = line.user_id;
    this.created_at = line.created_at;
    this.updated_at = line.updated_at;
  }

  /**
   * Create a new telecom line
   * @param {Object} newLine - Telecom line object
   * @returns {Promise} - Created telecom line
   */
  static async create(newLine) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO telecom_lines (phone_number, assigned_to, plan_id, monthly_limit, current_usage, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          newLine.phone_number,
          newLine.assigned_to,
          newLine.plan_id,
          newLine.monthly_limit,
          newLine.current_usage || 0,
          newLine.status || 'active',
          newLine.user_id
        ]
      );

      const [line] = await pool.execute('SELECT * FROM telecom_lines WHERE id = ?', [result.insertId]);
      return line[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find telecom line by ID
   * @param {number} id - Telecom line ID
   * @returns {Promise} - Telecom line object
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT tl.*, sp.name as plan_name, sp.data_limit, sp.calls, sp.sms, sp.price
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        WHERE tl.id = ?
      `, [id]);
      
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find telecom line by phone number
   * @param {string} phoneNumber - Phone number
   * @returns {Promise} - Telecom line object
   */
  static async findByPhoneNumber(phoneNumber) {
    try {
      const [rows] = await pool.execute(`
        SELECT tl.*, sp.name as plan_name, sp.data_limit, sp.calls, sp.sms, sp.price
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        WHERE tl.phone_number = ?
      `, [phoneNumber]);
      
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all telecom lines for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (limit, offset, search, status)
   * @returns {Promise} - Array of telecom lines
   */
  static async findAllByUser(userId, options = {}) {
    try {
      let query = `
        SELECT tl.*, sp.name as plan_name, sp.data_limit, sp.calls, sp.sms, sp.price
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        WHERE tl.user_id = ?
      `;
      
      const queryParams = [userId];
      
      // Add search filter if provided
      if (options.search) {
        query += ' AND (tl.phone_number LIKE ? OR tl.assigned_to LIKE ?)';
        const searchTerm = `%${options.search}%`;
        queryParams.push(searchTerm, searchTerm);
      }
      
      // Add status filter if provided
      if (options.status) {
        query += ' AND tl.status = ?';
        queryParams.push(options.status);
      }
      
      // Add sorting
      query += ' ORDER BY tl.id DESC';
      
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
   * Update telecom line
   * @param {number} id - Telecom line ID
   * @param {Object} line - Telecom line object with updated fields
   * @returns {Promise} - Updated telecom line
   */
  static async update(id, line) {
    try {
      let query = 'UPDATE telecom_lines SET ';
      const values = [];
      const fields = [];

      if (line.phone_number) {
        fields.push('phone_number = ?');
        values.push(line.phone_number);
      }

      if (line.assigned_to) {
        fields.push('assigned_to = ?');
        values.push(line.assigned_to);
      }

      if (line.plan_id) {
        fields.push('plan_id = ?');
        values.push(line.plan_id);
      }

      if (line.monthly_limit) {
        fields.push('monthly_limit = ?');
        values.push(line.monthly_limit);
      }

      if (line.current_usage !== undefined) {
        fields.push('current_usage = ?');
        values.push(line.current_usage);
      }

      if (line.status) {
        fields.push('status = ?');
        values.push(line.status);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      query += fields.join(', ');
      query += ' WHERE id = ?';
      values.push(id);

      await pool.execute(query, values);
      
      const [updatedLine] = await pool.execute(`
        SELECT tl.*, sp.name as plan_name, sp.data_limit, sp.calls, sp.sms, sp.price
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        WHERE tl.id = ?
      `, [id]);
      
      return updatedLine[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete telecom line
   * @param {number} id - Telecom line ID
   * @returns {Promise} - Boolean indicating success
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM telecom_lines WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get total count of telecom lines for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (search, status)
   * @returns {Promise} - Count of telecom lines
   */
  static async getTotalCount(userId, options = {}) {
    try {
      let query = 'SELECT COUNT(*) as count FROM telecom_lines WHERE user_id = ?';
      const queryParams = [userId];
      
      // Add search filter if provided
      if (options.search) {
        query += ' AND (phone_number LIKE ? OR assigned_to LIKE ?)';
        const searchTerm = `%${options.search}%`;
        queryParams.push(searchTerm, searchTerm);
      }
      
      // Add status filter if provided
      if (options.status) {
        query += ' AND status = ?';
        queryParams.push(options.status);
      }
      
      const [rows] = await pool.execute(query, queryParams);
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TelecomLine;
