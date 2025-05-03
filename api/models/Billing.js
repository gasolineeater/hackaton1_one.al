import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Customer from './Customer.js';

const Billing = sequelize.define('Billing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id'
    }
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  billingPeriodStart: {
    type: DataTypes.DATE,
    allowNull: false
  },
  billingPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'issued', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'draft'
  },
  paymentMethod: {
    type: DataTypes.STRING
  },
  paymentDate: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'billings'
});

// Define associations
Customer.hasMany(Billing, { foreignKey: 'customerId' });
Billing.belongsTo(Customer, { foreignKey: 'customerId' });

export default Billing;
