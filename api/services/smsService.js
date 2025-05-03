import dotenv from 'dotenv';

dotenv.config();

/**
 * Service for SMS operations
 * Handles SMS sending and templating
 */
class SmsService {
  constructor() {
    this.initialized = false;
    this.provider = null;
    this.initializeProvider();
  }
  
  /**
   * Initialize SMS provider
   */
  initializeProvider() {
    try {
      // Get SMS configuration from environment variables
      const provider = process.env.SMS_PROVIDER;
      const apiKey = process.env.SMS_API_KEY;
      const apiSecret = process.env.SMS_API_SECRET;
      
      // Check if SMS is configured
      if (!provider || !apiKey) {
        console.warn('SMS service not fully configured. Some features will be simulated.');
        this.initialized = false;
        return;
      }
      
      // Initialize provider based on configuration
      switch (provider.toLowerCase()) {
        case 'twilio':
          // In a real implementation, you would initialize the Twilio client here
          // this.provider = new Twilio(apiKey, apiSecret);
          this.provider = 'twilio';
          break;
        case 'nexmo':
          // In a real implementation, you would initialize the Nexmo client here
          // this.provider = new Nexmo({ apiKey, apiSecret });
          this.provider = 'nexmo';
          break;
        default:
          console.warn(\`Unsupported SMS provider: \${provider}\`);
          this.initialized = false;
          return;
      }
      
      this.initialized = true;
      console.log(\`SMS service initialized successfully with provider: \${provider}\`);
    } catch (error) {
      console.error('Error initializing SMS service:', error);
      this.initialized = false;
    }
  }
  
  /**
   * Send SMS
   * @param {Object} smsData - SMS data
   * @returns {Promise<Object>} Send result
   */
  async sendSms(smsData) {
    try {
      const { to, message } = smsData;
      
      // Validate SMS data
      if (!to || !message) {
        return {
          success: false,
          error: 'Missing required SMS fields'
        };
      }
      
      // Format phone number (remove spaces, ensure international format)
      const formattedPhone = this.formatPhoneNumber(to);
      
      // If SMS service is not initialized, simulate sending
      if (!this.initialized) {
        console.log('SMS service not initialized. Simulating SMS send:');
        console.log(\`To: \${formattedPhone}\`);
        console.log(\`Message: \${message.substring(0, 50)}...\`);
        
        return {
          success: true,
          message: 'SMS simulated successfully',
          simulated: true
        };
      }
      
      // Send SMS based on provider
      let result;
      
      switch (this.provider) {
        case 'twilio':
          result = await this.sendViaTwilio(formattedPhone, message);
          break;
        case 'nexmo':
          result = await this.sendViaNexmo(formattedPhone, message);
          break;
        default:
          return {
            success: false,
            error: 'No SMS provider configured'
          };
      }
      
      return result;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Format phone number
   * @param {string} phone - Phone number
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove spaces, dashes, parentheses
    let formatted = phone.replace(/[\\s\\-\\(\\)]/g, '');
    
    // Ensure it starts with +
    if (!formatted.startsWith('+')) {
      // If it starts with 00, replace with +
      if (formatted.startsWith('00')) {
        formatted = '+' + formatted.substring(2);
      } else {
        // Assume Albania if no country code
        formatted = '+355' + formatted;
      }
    }
    
    return formatted;
  }
  
  /**
   * Send SMS via Twilio
   * @param {string} to - Recipient phone number
   * @param {string} message - SMS message
   * @returns {Promise<Object>} Send result
   */
  async sendViaTwilio(to, message) {
    // In a real implementation, you would use the Twilio SDK here
    // For now, we'll simulate it
    console.log('Simulating Twilio SMS send:');
    console.log(\`To: \${to}\`);
    console.log(\`Message: \${message.substring(0, 50)}...\`);
    
    return {
      success: true,
      message: 'SMS sent successfully via Twilio',
      messageId: 'SM' + Math.random().toString(36).substring(2, 15)
    };
  }
  
  /**
   * Send SMS via Nexmo
   * @param {string} to - Recipient phone number
   * @param {string} message - SMS message
   * @returns {Promise<Object>} Send result
   */
  async sendViaNexmo(to, message) {
    // In a real implementation, you would use the Nexmo SDK here
    // For now, we'll simulate it
    console.log('Simulating Nexmo SMS send:');
    console.log(\`To: \${to}\`);
    console.log(\`Message: \${message.substring(0, 50)}...\`);
    
    return {
      success: true,
      message: 'SMS sent successfully via Nexmo',
      messageId: 'NX' + Math.random().toString(36).substring(2, 15)
    };
  }
  
  /**
   * Send verification code
   * @param {string} phone - Phone number
   * @param {string} code - Verification code
   * @returns {Promise<Object>} Send result
   */
  async sendVerificationCode(phone, code) {
    try {
      const message = \`Your ONE Albania verification code is: \${code}. This code will expire in 10 minutes.\`;
      
      return await this.sendSms({
        to: phone,
        message
      });
    } catch (error) {
      console.error('Error sending verification code:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Send usage alert
   * @param {Object} alertData - Alert data
   * @returns {Promise<Object>} Send result
   */
  async sendUsageAlert(alertData) {
    try {
      const { phone, serviceType, usagePercentage, limit } = alertData;
      
      let message = \`ONE Albania: You've used \${usagePercentage}% of your \${serviceType} limit\`;
      
      if (limit) {
        message += \` (\${limit})\`;
      }
      
      message += '. Log in to your account for details.';
      
      return await this.sendSms({
        to: phone,
        message
      });
    } catch (error) {
      console.error('Error sending usage alert:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Send billing reminder
   * @param {Object} billingData - Billing data
   * @returns {Promise<Object>} Send result
   */
  async sendBillingReminder(billingData) {
    try {
      const { phone, invoiceNumber, amount, dueDate } = billingData;
      
      // Format date
      const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      const message = \`ONE Albania: Invoice #\${invoiceNumber} for €\${amount.toFixed(2)} is due on \${formattedDueDate}. Please log in to your account to make a payment.\`;
      
      return await this.sendSms({
        to: phone,
        message
      });
    } catch (error) {
      console.error('Error sending billing reminder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export a singleton instance
export default new SmsService();
