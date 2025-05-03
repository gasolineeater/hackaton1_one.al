import { sequelize } from '../config/database.js';
import Customer from './Customer.js';
import Service from './Service.js';
import Subscription from './Subscription.js';
import Usage from './Usage.js';
import Billing from './Billing.js';
import BillingItem from './BillingItem.js';
import User from './User.js';
import RefreshToken from './RefreshToken.js';
import Notification from './Notification.js';
import NotificationTemplate from './NotificationTemplate.js';

// Define all model relationships here if needed
// (Most relationships are already defined in the individual model files)

// Function to sync all models with the database
async function syncDatabase(force = false) {
  try {
    await sequelize.sync({ force });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

export {
  sequelize,
  syncDatabase,
  Customer,
  Service,
  Subscription,
  Usage,
  Billing,
  BillingItem,
  User,
  RefreshToken,
  Notification,
  NotificationTemplate
};
