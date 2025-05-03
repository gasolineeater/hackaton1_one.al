import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Mobile', 'Internet', 'Fixed Line', 'Cloud', 'IoT'),
    allowNull: false
  },
  monthlyCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  setupFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  contractLength: {
    type: DataTypes.INTEGER, // in months
    allowNull: false,
    defaultValue: 12
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false
  },
  limitations: {
    type: DataTypes.JSON
  },
  popularity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    }
  },
  bestFor: {
    type: DataTypes.JSON
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  oneAlbaniaId: {
    type: DataTypes.STRING,
    unique: true,
    comment: 'External service ID from ONE Albania API'
  }
}, {
  timestamps: true,
  tableName: 'services'
});

export default Service;
