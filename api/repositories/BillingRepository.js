import BaseRepository from './BaseRepository.js';
import { Billing, BillingItem, Customer, Subscription, Service, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

class BillingRepository extends BaseRepository {
  constructor() {
    super(Billing);
  }

  /**
   * Find billing with items
   * @param {number} id - Billing ID
   * @returns {Promise<Object>} Billing with items
   */
  async findWithItems(id) {
    return await this.findById(id, {
      include: [{
        model: BillingItem,
        include: [{
          model: Subscription,
          include: [Service]
        }]
      }, Customer]
    });
  }

  /**
   * Find billings by customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} Billings
   */
  async findByCustomer(customerId) {
    return await this.findAll({
      where: { customerId },
      include: [Customer]
    });
  }

  /**
   * Find billings by status
   * @param {string} status - Billing status
   * @returns {Promise<Array>} Billings
   */
  async findByStatus(status) {
    return await this.findAll({
      where: { status },
      include: [Customer]
    });
  }

  /**
   * Find billings by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Billings
   */
  async findByDateRange(startDate, endDate) {
    return await this.findAll({
      where: {
        issueDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [Customer]
    });
  }

  /**
   * Find overdue billings
   * @returns {Promise<Array>} Overdue billings
   */
  async findOverdue() {
    const today = new Date();

    return await this.findAll({
      where: {
        dueDate: {
          [Op.lt]: today
        },
        status: {
          [Op.notIn]: ['paid', 'cancelled']
        }
      },
      include: [Customer]
    });
  }

  /**
   * Get billing summary by customer
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Billing summary
   */
  async getSummaryByCustomer(startDate, endDate) {
    return await this.model.findAll({
      attributes: [
        'customerId',
        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'invoiceCount']
      ],
      where: {
        issueDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Customer,
        attributes: ['companyName', 'businessType']
      }],
      group: ['customerId', 'Customer.id']
    });
  }
}

export default new BillingRepository();
