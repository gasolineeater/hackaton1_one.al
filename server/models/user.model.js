const { pool } = require('../config/db.config');
const bcrypt = require('bcrypt');

/**
 * User Model
 */
class User {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role || 'user';
    this.company_name = user.company_name;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }

  /**
   * Create a new user
   * @param {Object} newUser - User object
   * @returns {Promise} - Created user
   */
  static async create(newUser) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newUser.password, salt);

      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password, role, company_name) VALUES (?, ?, ?, ?, ?)',
        [newUser.username, newUser.email, hashedPassword, newUser.role || 'user', newUser.company_name]
      );

      const [user] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      return user[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise} - User object
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise} - User object
   */
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise} - User object
   */
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users
   * @returns {Promise} - Array of users
   */
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT id, username, email, role, company_name, created_at, updated_at FROM users');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} user - User object with updated fields
   * @returns {Promise} - Updated user
   */
  static async update(id, user) {
    try {
      let query = 'UPDATE users SET ';
      const values = [];
      const fields = [];

      if (user.username) {
        fields.push('username = ?');
        values.push(user.username);
      }

      if (user.email) {
        fields.push('email = ?');
        values.push(user.email);
      }

      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        fields.push('password = ?');
        values.push(hashedPassword);
      }

      if (user.role) {
        fields.push('role = ?');
        values.push(user.role);
      }

      if (user.company_name) {
        fields.push('company_name = ?');
        values.push(user.company_name);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      query += fields.join(', ');
      query += ' WHERE id = ?';
      values.push(id);

      await pool.execute(query, values);
      const [updatedUser] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
      return updatedUser[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise} - Boolean indicating success
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise} - Boolean indicating if password is valid
   */
  static async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Save refresh token
   * @param {number} userId - User ID
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} - Boolean indicating success
   */
  static async saveRefreshToken(userId, refreshToken) {
    try {
      // Calculate expiration (7 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Save token
      const [result] = await pool.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, refreshToken, expiresAt]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify refresh token
   * @param {number} userId - User ID
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} - Boolean indicating if token is valid
   */
  static async verifyRefreshToken(userId, refreshToken) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM refresh_tokens WHERE user_id = ? AND token = ? AND expires_at > NOW()',
        [userId, refreshToken]
      );

      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update refresh token
   * @param {number} userId - User ID
   * @param {string} oldToken - Old refresh token
   * @param {string} newToken - New refresh token
   * @returns {Promise} - Boolean indicating success
   */
  static async updateRefreshToken(userId, oldToken, newToken) {
    try {
      // Invalidate old token
      await pool.execute(
        'DELETE FROM refresh_tokens WHERE user_id = ? AND token = ?',
        [userId, oldToken]
      );

      // Save new token
      return await this.saveRefreshToken(userId, newToken);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Invalidate refresh token
   * @param {number} userId - User ID
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} - Boolean indicating success
   */
  static async invalidateRefreshToken(userId, refreshToken) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM refresh_tokens WHERE user_id = ? AND token = ?',
        [userId, refreshToken]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Invalidate all refresh tokens for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Boolean indicating success
   */
  static async invalidateAllRefreshTokens(userId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM refresh_tokens WHERE user_id = ?',
        [userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
