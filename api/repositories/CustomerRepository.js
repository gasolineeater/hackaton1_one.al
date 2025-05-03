import BaseRepository from './BaseRepository.js';
import { Customer, Subscription, Service } from '../models/index.js';
import { Op } from 'sequelize';

class CustomerRepository extends BaseRepository {
  constructor() {
    super(Customer);
  }

  /**
   * Find customer with all subscriptions
   * @param {number} id - Customer ID
   * @returns {Promise<Object>} Customer with subscriptions
   */
  async findWithSubscriptions(id) {
    return await this.findById(id, {
      include: [{
        model: Subscription,
        include: [Service]
      }]
    });
  }

  /**
   * Find customers by business type
   * @param {string} businessType - Business type
   * @returns {Promise<Array>} Customers
   */
  async findByBusinessType(businessType) {
    return await this.findAll({
      where: { businessType }
    });
  }

  /**
   * Find customers by status
   * @param {string} status - Customer status
   * @returns {Promise<Array>} Customers
   */
  async findByStatus(status) {
    return await this.findAll({
      where: { status }
    });
  }

  /**
   * Search customers by name or email
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching customers
   */
  async search(query) {
    return await this.findAll({
      where: {
        [Op.or]: [
          { companyName: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { contactPerson: { [Op.like]: `%${query}%` } }
        ]
      }
    });
  }
}

export default new CustomerRepository();
