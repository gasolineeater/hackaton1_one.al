import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const NotificationTemplate = sequelize.define('NotificationTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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
  titleTemplate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  messageTemplate: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  emailSubjectTemplate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emailBodyTemplate: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  smsTemplate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  actionUrlTemplate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  defaultDeliveryMethod: {
    type: DataTypes.ENUM('in-app', 'email', 'sms', 'all'),
    defaultValue: 'in-app'
  },
  expiryDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 30
  }
}, {
  timestamps: true,
  tableName: 'notification_templates'
});

export default NotificationTemplate;
