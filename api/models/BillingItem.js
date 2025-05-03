import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Billing from './Billing.js';
import Subscription from './Subscription.js';

const BillingItem = sequelize.define('BillingItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  billingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Billing,
      key: 'id'
    }
  },
  subscriptionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Subscription,
      key: 'id'
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  itemType: {
    type: DataTypes.ENUM('subscription', 'usage', 'one_time', 'setup', 'discount', 'other'),
    allowNull: false,
    defaultValue: 'subscription'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'billing_items'
});

// Define associations
Billing.hasMany(BillingItem, { foreignKey: 'billingId' });
BillingItem.belongsTo(Billing, { foreignKey: 'billingId' });

Subscription.hasMany(BillingItem, { foreignKey: 'subscriptionId' });
BillingItem.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

export default BillingItem;
