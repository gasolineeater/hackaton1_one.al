import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Customer from './Customer.js';
import Service from './Service.js';

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      key: 'id'
    }
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Service,
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'suspended', 'cancelled', 'expired'),
    defaultValue: 'active'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  monthlyCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  setupFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  billingCycle: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'annually'),
    defaultValue: 'monthly'
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT
  },
  externalId: {
    type: DataTypes.STRING,
    unique: true,
    comment: 'External subscription ID from ONE Albania API'
  }
}, {
  timestamps: true,
  tableName: 'subscriptions'
});

// Define associations
Customer.hasMany(Subscription, { foreignKey: 'customerId' });
Subscription.belongsTo(Customer, { foreignKey: 'customerId' });

Service.hasMany(Subscription, { foreignKey: 'serviceId' });
Subscription.belongsTo(Service, { foreignKey: 'serviceId' });

export default Subscription;
