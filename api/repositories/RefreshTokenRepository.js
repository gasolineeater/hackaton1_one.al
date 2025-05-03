import BaseRepository from './BaseRepository.js';
import { RefreshToken, User } from '../models/index.js';
import { Op } from 'sequelize';

class RefreshTokenRepository extends BaseRepository {
  constructor() {
    super(RefreshToken);
  }

  /**
   * Find token by value
   * @param {string} token - Token value
   * @returns {Promise<Object>} Token
   */
  async findByToken(token) {
    return await this.findOne({
      token
    });
  }

  /**
   * Find valid token by value
   * @param {string} token - Token value
   * @returns {Promise<Object>} Token
   */
  async findValidToken(token) {
    return await this.findOne({
      token,
      expiryDate: { [Op.gt]: new Date() },
      isRevoked: false
    });
  }

  /**
   * Find tokens by user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Tokens
   */
  async findByUser(userId) {
    return await this.findAll({
      where: { userId }
    });
  }

  /**
   * Find valid tokens by user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Tokens
   */
  async findValidTokensByUser(userId) {
    return await this.findAll({
      where: {
        userId,
        expiryDate: { [Op.gt]: new Date() },
        isRevoked: false
      }
    });
  }

  /**
   * Revoke token
   * @param {string} token - Token value
   * @returns {Promise<Array>} [affectedCount, affectedRows]
   */
  async revokeToken(token) {
    return await this.update(
      { isRevoked: true },
      { token }
    );
  }

  /**
   * Revoke all tokens for user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} [affectedCount, affectedRows]
   */
  async revokeAllUserTokens(userId) {
    return await this.update(
      { isRevoked: true },
      { userId }
    );
  }

  /**
   * Delete expired tokens
   * @returns {Promise<number>} Number of deleted rows
   */
  async deleteExpiredTokens() {
    return await this.delete({
      [Op.or]: [
        { expiryDate: { [Op.lt]: new Date() } },
        { isRevoked: true }
      ]
    });
  }
}

export default new RefreshTokenRepository();
