import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Subscription from './Subscription.js';

const Usage = sequelize.define('Usage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subscriptionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Subscription,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  usageType: {
    type: DataTypes.ENUM('data', 'voice', 'sms', 'api_calls', 'storage', 'compute', 'other'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  department: {
    type: DataTypes.STRING
  },
  employeeId: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  deviceId: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'usage_records'
});

// Define associations
Subscription.hasMany(Usage, { foreignKey: 'subscriptionId' });
Usage.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

export default Usage;
