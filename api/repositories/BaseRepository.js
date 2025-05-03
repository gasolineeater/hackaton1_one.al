/**
 * Base repository class with common CRUD operations
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Find all records
   * @param {Object} options - Query options (where, include, order, etc.)
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  /**
   * Find a record by ID
   * @param {number|string} id - Record ID
   * @param {Object} options - Query options (include, attributes, etc.)
   * @returns {Promise<Object>} Found record or null
   */
  async findById(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  /**
   * Find one record by criteria
   * @param {Object} where - Where conditions
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Found record or null
   */
  async findOne(where, options = {}) {
    return await this.model.findOne({ where, ...options });
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Update a record
   * @param {Object} data - New data
   * @param {Object} where - Where conditions
   * @returns {Promise<Array>} [affectedCount, affectedRows]
   */
  async update(data, where) {
    return await this.model.update(data, { where, returning: true });
  }

  /**
   * Delete a record
   * @param {Object} where - Where conditions
   * @returns {Promise<number>} Number of deleted rows
   */
  async delete(where) {
    return await this.model.destroy({ where });
  }

  /**
   * Count records
   * @param {Object} where - Where conditions
   * @returns {Promise<number>} Count of records
   */
  async count(where = {}) {
    return await this.model.count({ where });
  }

  /**
   * Find records with pagination
   * @param {number} page - Page number (1-based)
   * @param {number} pageSize - Page size
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Paginated results
   */
  async findWithPagination(page = 1, pageSize = 10, options = {}) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    
    const { count, rows } = await this.model.findAndCountAll({
      ...options,
      offset,
      limit
    });
    
    return {
      data: rows,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    };
  }
}

export default BaseRepository;
