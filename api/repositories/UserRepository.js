import BaseRepository from './BaseRepository.js';
import { User, Customer, RefreshToken } from '../models/index.js';
import { Op } from 'sequelize';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} User
   */
  async findByUsername(username) {
    return await this.findOne({
      username
    });
  }

  /**
   * Find user by email
   * @param {string} email - Email
   * @returns {Promise<Object>} User
   */
  async findByEmail(email) {
    return await this.findOne({
      email
    });
  }

  /**
   * Find user with customer details
   * @param {number} id - User ID
   * @returns {Promise<Object>} User with customer
   */
  async findWithCustomer(id) {
    return await this.findById(id, {
      include: [Customer]
    });
  }

  /**
   * Find users by role
   * @param {string} role - User role
   * @returns {Promise<Array>} Users
   */
  async findByRole(role) {
    return await this.findAll({
      where: { role }
    });
  }

  /**
   * Find users by customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} Users
   */
  async findByCustomer(customerId) {
    return await this.findAll({
      where: { customerId }
    });
  }

  /**
   * Find user by reset token
   * @param {string} token - Reset token
   * @returns {Promise<Object>} User
   */
  async findByResetToken(token) {
    return await this.findOne({
      passwordResetToken: token,
      passwordResetExpires: { [Op.gt]: new Date() }
    });
  }

  /**
   * Update last login
   * @param {number} id - User ID
   * @returns {Promise<Array>} [affectedCount, affectedRows]
   */
  async updateLastLogin(id) {
    return await this.update(
      { lastLogin: new Date() },
      { id }
    );
  }

  /**
   * Find user with refresh tokens
   * @param {number} id - User ID
   * @returns {Promise<Object>} User with tokens
   */
  async findWithRefreshTokens(id) {
    return await this.findById(id, {
      include: [RefreshToken]
    });
  }
}

export default new UserRepository();
