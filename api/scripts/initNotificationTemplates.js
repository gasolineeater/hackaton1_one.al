import { NotificationTemplate } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize default notification templates
 */
async function initNotificationTemplates() {
  try {
    console.log('Initializing notification templates...');
    
    // Define default templates
    const defaultTemplates = [
      {
        name: 'welcome',
        description: 'Welcome message for new users',
        type: 'info',
        category: 'system',
        priority: 'medium',
        titleTemplate: 'Welcome to ONE Albania SME Dashboard',
        messageTemplate: 'Hello {{firstName}} {{lastName}}, welcome to ONE Albania SME Dashboard! Your account has been successfully created.',
        emailSubjectTemplate: 'Welcome to ONE Albania SME Dashboard',
        emailBodyTemplate: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to ONE Albania!</h2>
            <p>Hello {{firstName}} {{lastName}},</p>
            <p>Thank you for registering with ONE Albania SME Dashboard{{#companyName}} for {{companyName}}{{/companyName}}.</p>
            <p>Your account has been successfully created, and you can now access all the features of our platform.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://dashboard.onealbania.al'}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Dashboard</a>
            </div>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p>Thank you,<br>ONE Albania Team</p>
          </div>
        `,
        smsTemplate: 'Welcome to ONE Albania, {{firstName}}! Your account has been created successfully.',
        actionUrlTemplate: '${process.env.FRONTEND_URL || "https://dashboard.onealbania.al"}/dashboard',
        isActive: true,
        defaultDeliveryMethod: 'all',
        expiryDays: 30
      },
      {
        name: 'password_reset',
        description: 'Password reset notification',
        type: 'info',
        category: 'security',
        priority: 'high',
        titleTemplate: 'Password Reset Request',
        messageTemplate: 'A password reset has been requested for your account. Click the link to reset your password.',
        emailSubjectTemplate: 'ONE Albania - Password Reset Request',
        emailBodyTemplate: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello {{firstName}} {{lastName}},</p>
            <p>We received a request to reset your password for your ONE Albania account.</p>
            <p>To reset your password, please click the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{resetUrl}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </div>
            <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
            <p>This link will expire in 1 hour.</p>
            <p>Thank you,<br>ONE Albania Team</p>
          </div>
        `,
        smsTemplate: 'ONE Albania: Password reset requested. Use this link to reset: {{resetUrl}}',
        actionUrlTemplate: '{{resetUrl}}',
        isActive: true,
        defaultDeliveryMethod: 'all',
        expiryDays: 1
      },
      {
        name: 'billing_new_invoice',
        description: 'New invoice notification',
        type: 'info',
        category: 'billing',
        priority: 'medium',
        titleTemplate: 'New Invoice Available',
        messageTemplate: 'Your new invoice #{{invoiceNumber}} for €{{amount}} is now available. Due date: {{dueDate}}',
        emailSubjectTemplate: 'ONE Albania - Invoice #{{invoiceNumber}} Ready',
        emailBodyTemplate: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Invoice Available</h2>
            <p>Hello {{companyName}},</p>
            <p>Your new invoice #{{invoiceNumber}} is now available.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Invoice Number:</strong> {{invoiceNumber}}</p>
              <p><strong>Amount:</strong> €{{amount}}</p>
              <p><strong>Due Date:</strong> {{dueDate}}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{invoiceUrl}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Invoice</a>
            </div>
            <p>If you have any questions about this invoice, please contact our billing department.</p>
            <p>Thank you,<br>ONE Albania Team</p>
          </div>
        `,
        smsTemplate: 'ONE Albania: New invoice #{{invoiceNumber}} for €{{amount}} is ready. Due: {{dueDate}}',
        actionUrlTemplate: '{{invoiceUrl}}',
        isActive: true,
        defaultDeliveryMethod: 'all',
        expiryDays: 30
      },
      {
        name: 'billing_payment_reminder',
        description: 'Payment reminder notification',
        type: 'warning',
        category: 'billing',
        priority: 'high',
        titleTemplate: 'Payment Reminder',
        messageTemplate: 'Your invoice #{{invoiceNumber}} for €{{amount}} is due in {{daysToDue}} days. Please make your payment before {{dueDate}}.',
        emailSubjectTemplate: 'ONE Albania - Payment Reminder for Invoice #{{invoiceNumber}}',
        emailBodyTemplate: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Payment Reminder</h2>
            <p>Hello {{companyName}},</p>
            <p>This is a friendly reminder that your invoice #{{invoiceNumber}} is due in {{daysToDue}} days.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Invoice Number:</strong> {{invoiceNumber}}</p>
              <p><strong>Amount:</strong> €{{amount}}</p>
              <p><strong>Due Date:</strong> {{dueDate}}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{invoiceUrl}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Invoice</a>
            </div>
            <p>Please make your payment before the due date to avoid any service interruptions.</p>
            <p>Thank you,<br>ONE Albania Team</p>
          </div>
        `,
        smsTemplate: 'ONE Albania: Reminder - Invoice #{{invoiceNumber}} for €{{amount}} is due in {{daysToDue}} days ({{dueDate}}).',
        actionUrlTemplate: '{{invoiceUrl}}',
        isActive: true,
        defaultDeliveryMethod: 'all',
        expiryDays: 7
      },
      {
        name: 'usage_alert',
        description: 'Usage threshold alert',
        type: 'warning',
        category: 'usage',
        priority: 'medium',
        titleTemplate: '{{serviceType}} Usage Alert',
        messageTemplate: 'You have used {{usagePercentage}}% of your {{serviceType}} limit. Current usage: {{currentUsage}} of {{limit}}.',
        emailSubjectTemplate: 'ONE Albania - {{serviceType}} Usage Alert',
        emailBodyTemplate: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Usage Alert</h2>
            <p>Hello {{firstName}} {{lastName}},</p>
            <p>This is to inform you that you have used <strong>{{usagePercentage}}%</strong> of your {{serviceType}} limit.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Service:</strong> {{serviceType}}</p>
              <p><strong>Current Usage:</strong> {{currentUsage}}</p>
              <p><strong>Limit:</strong> {{limit}}</p>
              <p><strong>Billing Period:</strong> {{billingPeriod}}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboardUrl}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Usage Details</a>
            </div>
            <p>If you need to increase your limit or have any questions, please contact our customer support.</p>
            <p>Thank you,<br>ONE Albania Team</p>
          </div>
        `,
        smsTemplate: 'ONE Albania: You\'ve used {{usagePercentage}}% of your {{serviceType}} limit ({{currentUsage}} of {{limit}}).',
        actionUrlTemplate: '{{dashboardUrl}}',
        isActive: true,
        defaultDeliveryMethod: 'all',
        expiryDays: 7
      },
      {
        name: 'service_activation',
        description: 'Service activation notification',
        type: 'success',
        category: 'service',
        priority: 'medium',
        titleTemplate: '{{serviceName}} Activated',
        messageTemplate: 'Your {{serviceName}} service has been successfully activated. It is now ready to use.',
        emailSubjectTemplate: 'ONE Albania - {{serviceName}} Service Activated',
        emailBodyTemplate: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Service Activated</h2>
            <p>Hello {{firstName}} {{lastName}},</p>
            <p>We're pleased to inform you that your <strong>{{serviceName}}</strong> service has been successfully activated and is now ready to use.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Service:</strong> {{serviceName}}</p>
              <p><strong>Activation Date:</strong> {{activationDate}}</p>
              <p><strong>Monthly Cost:</strong> €{{monthlyCost}}</p>
              <p><strong>Billing Cycle:</strong> {{billingCycle}}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{serviceUrl}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Manage Service</a>
            </div>
            <p>If you have any questions about your new service, please contact our customer support.</p>
            <p>Thank you for choosing ONE Albania!</p>
            <p>Best regards,<br>ONE Albania Team</p>
          </div>
        `,
        smsTemplate: 'ONE Albania: Your {{serviceName}} service has been activated successfully and is ready to use.',
        actionUrlTemplate: '{{serviceUrl}}',
        isActive: true,
        defaultDeliveryMethod: 'all',
        expiryDays: 30
      },
      {
        name: 'service_change',
        description: 'Service change notification',
        type: 'info',
        category: 'service',
        priority: 'medium',
        titleTemplate: '{{serviceName}} Plan Changed',
        messageTemplate: 'Your {{serviceName}} plan has been changed from {{oldPlan}} to {{newPlan}}. The change will be effective from {{effectiveDate}}.',
        emailSubjectTemplate: 'ONE Albania - {{serviceName}} Plan Changed',
        emailBodyTemplate: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Service Plan Changed</h2>
            <p>Hello {{firstName}} {{lastName}},</p>
            <p>We're writing to confirm that your <strong>{{serviceName}}</strong> plan has been changed as requested.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Service:</strong> {{serviceName}}</p>
              <p><strong>Previous Plan:</strong> {{oldPlan}}</p>
              <p><strong>New Plan:</strong> {{newPlan}}</p>
              <p><strong>Effective Date:</strong> {{effectiveDate}}</p>
              <p><strong>New Monthly Cost:</strong> €{{newMonthlyCost}}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{serviceUrl}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Service Details</a>
            </div>
            <p>If you have any questions about this change, please contact our customer support.</p>
            <p>Thank you for choosing ONE Albania!</p>
            <p>Best regards,<br>ONE Albania Team</p>
          </div>
        `,
        smsTemplate: 'ONE Albania: Your {{serviceName}} plan has been changed from {{oldPlan}} to {{newPlan}}, effective {{effectiveDate}}.',
        actionUrlTemplate: '{{serviceUrl}}',
        isActive: true,
        defaultDeliveryMethod: 'all',
        expiryDays: 30
      },
      {
        name: 'security_alert',
        description: 'Security alert notification',
        type: 'alert',
        category: 'security',
        priority: 'critical',
        titleTemplate: 'Security Alert - {{alertType}}',
        messageTemplate: 'We detected a {{alertType}} on your account. If this wasn\'t you, please contact support immediately.',
        emailSubjectTemplate: 'ONE Albania - Security Alert: {{alertType}}',
        emailBodyTemplate: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #cc0000;">Security Alert</h2>
            <p>Hello {{firstName}} {{lastName}},</p>
            <p>We detected a <strong>{{alertType}}</strong> on your account.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Alert Type:</strong> {{alertType}}</p>
              <p><strong>Time:</strong> {{alertTime}}</p>
              <p><strong>Location:</strong> {{alertLocation}}</p>
              <p><strong>IP Address:</strong> {{ipAddress}}</p>
              <p><strong>Device:</strong> {{device}}</p>
            </div>
            <p><strong>If this was you</strong>, you can ignore this message.</p>
            <p><strong>If this wasn't you</strong>, please take the following steps immediately:</p>
            <ol>
              <li>Change your password</li>
              <li>Review your account activity</li>
              <li>Contact our support team</li>
            </ol>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{securityUrl}}" style="background-color: #cc0000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Secure Your Account</a>
            </div>
            <p>If you need assistance, please contact our security team immediately.</p>
            <p>Thank you,<br>ONE Albania Security Team</p>
          </div>
        `,
        smsTemplate: 'ONE Albania ALERT: {{alertType}} detected on your account at {{alertTime}}. If this wasn\'t you, please call support immediately at +355 42 27 5000.',
        actionUrlTemplate: '{{securityUrl}}',
        isActive: true,
        defaultDeliveryMethod: 'all',
        expiryDays: 7
      }
    ];
    
    // Check if templates already exist
    for (const template of defaultTemplates) {
      const existingTemplate = await NotificationTemplate.findOne({
        where: {
          name: template.name
        }
      });
      
      if (existingTemplate) {
        console.log(\`Template "\${template.name}" already exists, skipping...\`);
      } else {
        await NotificationTemplate.create(template);
        console.log(\`Created template "\${template.name}"\`);
      }
    }
    
    console.log('Notification templates initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing notification templates:', error);
    process.exit(1);
  }
}

// Run the function
initNotificationTemplates();
