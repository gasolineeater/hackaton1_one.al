import BaseRepository from './BaseRepository.js';
import { Usage, Subscription, Customer, Service } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';
import { sequelize } from '../config/database.js';

class UsageRepository extends BaseRepository {
  constructor() {
    super(Usage);
  }

  /**
   * Find usage by subscription
   * @param {number} subscriptionId - Subscription ID
   * @returns {Promise<Array>} Usage records
   */
  async findBySubscription(subscriptionId) {
    return await this.findAll({
      where: { subscriptionId },
      include: [{
        model: Subscription,
        include: [Service]
      }]
    });
  }

  /**
   * Find usage by customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} Usage records
   */
  async findByCustomer(customerId) {
    return await this.findAll({
      include: [{
        model: Subscription,
        where: { customerId },
        include: [Service, Customer]
      }]
    });
  }

  /**
   * Find usage by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Usage records
   */
  async findByDateRange(startDate, endDate) {
    return await this.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Subscription,
        include: [Service, Customer]
      }]
    });
  }

  /**
   * Get usage summary by type
   * @param {number} customerId - Customer ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Usage summary
   */
  async getSummaryByType(customerId, startDate, endDate) {
    return await this.model.findAll({
      attributes: [
        'usageType',
        [fn('SUM', col('quantity')), 'totalQuantity'],
        [fn('SUM', col('cost')), 'totalCost']
      ],
      include: [{
        model: Subscription,
        attributes: [],
        where: { customerId },
        include: [{
          model: Service,
          attributes: []
        }]
      }],
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: ['usageType']
    });
  }

  /**
   * Get daily usage trend
   * @param {number} subscriptionId - Subscription ID
   * @param {number} days - Number of days
   * @returns {Promise<Array>} Daily usage
   */
  async getDailyTrend(subscriptionId, days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    return await this.model.findAll({
      attributes: [
        [fn('DATE', col('date')), 'day'],
        [fn('SUM', col('quantity')), 'totalQuantity'],
        [fn('SUM', col('cost')), 'totalCost']
      ],
      where: {
        subscriptionId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [fn('DATE', col('date'))],
      order: [[fn('DATE', col('date')), 'ASC']]
    });
  }
}

export default new UsageRepository();
