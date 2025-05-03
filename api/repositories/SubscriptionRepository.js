import BaseRepository from './BaseRepository.js';
import { Subscription, Customer, Service, Usage } from '../models/index.js';
import { Op } from 'sequelize';

class SubscriptionRepository extends BaseRepository {
  constructor() {
    super(Subscription);
  }

  /**
   * Find subscriptions by customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} Subscriptions
   */
  async findByCustomer(customerId) {
    return await this.findAll({
      where: { customerId },
      include: [Service]
    });
  }

  /**
   * Find subscriptions by service
   * @param {number} serviceId - Service ID
   * @returns {Promise<Array>} Subscriptions
   */
  async findByService(serviceId) {
    return await this.findAll({
      where: { serviceId },
      include: [Customer]
    });
  }

  /**
   * Find subscriptions by status
   * @param {string} status - Subscription status
   * @returns {Promise<Array>} Subscriptions
   */
  async findByStatus(status) {
    return await this.findAll({
      where: { status },
      include: [Customer, Service]
    });
  }

  /**
   * Find subscriptions expiring soon
   * @param {number} days - Days until expiration
   * @returns {Promise<Array>} Subscriptions
   */
  async findExpiringSoon(days = 30) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return await this.findAll({
      where: {
        endDate: {
          [Op.between]: [today, futureDate]
        }
      },
      include: [Customer, Service]
    });
  }

  /**
   * Find subscription with usage data
   * @param {number} id - Subscription ID
   * @returns {Promise<Object>} Subscription with usage
   */
  async findWithUsage(id) {
    return await this.findById(id, {
      include: [
        Customer,
        Service,
        Usage
      ]
    });
  }

  /**
   * Find subscriptions by billing cycle
   * @param {string} billingCycle - Billing cycle
   * @returns {Promise<Array>} Subscriptions
   */
  async findByBillingCycle(billingCycle) {
    return await this.findAll({
      where: { billingCycle },
      include: [Customer, Service]
    });
  }
}

export default new SubscriptionRepository();
