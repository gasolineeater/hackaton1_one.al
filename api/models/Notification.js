import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Customer from './Customer.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: 'id'
    },
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('info', 'warning', 'alert', 'success'),
    defaultValue: 'info'
  },
  category: {
    type: DataTypes.ENUM('system', 'billing', 'usage', 'service', 'security'),
    defaultValue: 'system'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actionUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  deliveryStatus: {
    type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed'),
    defaultValue: 'pending'
  },
  deliveryMethod: {
    type: DataTypes.ENUM('in-app', 'email', 'sms', 'all'),
    defaultValue: 'in-app'
  }
}, {
  timestamps: true,
  tableName: 'notifications'
});

// Define associations
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Customer.hasMany(Notification, { foreignKey: 'customerId' });
Notification.belongsTo(Customer, { foreignKey: 'customerId' });

export default Notification;
