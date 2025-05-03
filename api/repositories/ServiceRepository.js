import BaseRepository from './BaseRepository.js';
import { Service, Subscription, Customer, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

class ServiceRepository extends BaseRepository {
  constructor() {
    super(Service);
  }

  /**
   * Find services by category
   * @param {string} category - Service category
   * @returns {Promise<Array>} Services
   */
  async findByCategory(category) {
    return await this.findAll({
      where: { category }
    });
  }

  /**
   * Find active services
   * @returns {Promise<Array>} Active services
   */
  async findActive() {
    return await this.findAll({
      where: { isActive: true }
    });
  }

  /**
   * Find services by price range
   * @param {number} min - Minimum price
   * @param {number} max - Maximum price
   * @returns {Promise<Array>} Services in price range
   */
  async findByPriceRange(min, max) {
    return await this.findAll({
      where: {
        monthlyCost: {
          [Op.between]: [min, max]
        }
      }
    });
  }

  /**
   * Find services with subscription count
   * @returns {Promise<Array>} Services with subscription count
   */
  async findWithSubscriptionCount() {
    return await this.model.findAll({
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('Subscriptions.id')),
            'subscriptionCount'
          ]
        ]
      },
      include: [{
        model: Subscription,
        attributes: []
      }],
      group: ['Service.id']
    });
  }

  /**
   * Find most popular services
   * @param {number} limit - Number of services to return
   * @returns {Promise<Array>} Popular services
   */
  async findMostPopular(limit = 5) {
    return await this.findAll({
      order: [['popularity', 'DESC']],
      limit
    });
  }

  /**
   * Find services subscribed by a customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} Services
   */
  async findByCustomer(customerId) {
    return await this.findAll({
      include: [{
        model: Subscription,
        where: { customerId },
        required: true
      }]
    });
  }
}

export default new ServiceRepository();
