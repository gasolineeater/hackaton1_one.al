import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Service for email operations
 * Handles email sending and templating
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.initializeTransporter();
  }
  
  /**
   * Initialize email transporter
   */
  initializeTransporter() {
    try {
      // Get email configuration from environment variables
      const host = process.env.EMAIL_HOST;
      const port = process.env.EMAIL_PORT;
      const user = process.env.EMAIL_USER;
      const pass = process.env.EMAIL_PASSWORD;
      const secure = process.env.EMAIL_SECURE === 'true';
      
      // Check if email is configured
      if (!host || !port || !user) {
        console.warn('Email service not fully configured. Some features will be simulated.');
        this.initialized = false;
        return;
      }
      
      // Create transporter
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass
        }
      });
      
      this.initialized = true;
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Error initializing email service:', error);
      this.initialized = false;
    }
  }
  
  /**
   * Send email
   * @param {Object} emailData - Email data
   * @returns {Promise<Object>} Send result
   */
  async sendEmail(emailData) {
    try {
      const { to, subject, body, isHtml = false, attachments = [] } = emailData;
      
      // Validate email data
      if (!to || !subject || !body) {
        return {
          success: false,
          error: 'Missing required email fields'
        };
      }
      
      // If email service is not initialized, simulate sending
      if (!this.initialized) {
        console.log('Email service not initialized. Simulating email send:');
        console.log(\`To: \${to}\`);
        console.log(\`Subject: \${subject}\`);
        console.log(\`Body: \${body.substring(0, 100)}...\`);
        
        return {
          success: true,
          message: 'Email simulated successfully',
          simulated: true
        };
      }
      
      // Prepare email options
      const mailOptions = {
        from: process.env.EMAIL_FROM || \`ONE Albania <\${process.env.EMAIL_USER}>\`,
        to,
        subject,
        attachments
      };
      
      // Set email content based on format
      if (isHtml) {
        mailOptions.html = body;
      } else {
        mailOptions.text = body;
      }
      
      // Send email
      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        message: 'Email sent successfully',
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Send password reset email
   * @param {Object} userData - User data
   * @param {string} resetToken - Reset token
   * @param {string} resetUrl - Reset URL
   * @returns {Promise<Object>} Send result
   */
  async sendPasswordResetEmail(userData, resetToken, resetUrl) {
    try {
      const { email, firstName, lastName } = userData;
      
      // Create email content
      const subject = 'ONE Albania - Password Reset Request';
      const body = \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello \${firstName || ''} \${lastName || ''},</p>
          <p>We received a request to reset your password for your ONE Albania account.</p>
          <p>To reset your password, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
          <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Thank you,<br>ONE Albania Team</p>
        </div>
      \`;
      
      // Send email
      return await this.sendEmail({
        to: email,
        subject,
        body,
        isHtml: true
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Send welcome email
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Send result
   */
  async sendWelcomeEmail(userData) {
    try {
      const { email, firstName, lastName, companyName } = userData;
      
      // Create email content
      const subject = 'Welcome to ONE Albania SME Dashboard';
      const body = \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to ONE Albania!</h2>
          <p>Hello \${firstName || ''} \${lastName || ''},</p>
          <p>Thank you for registering with ONE Albania SME Dashboard\${companyName ? \` for \${companyName}\` : ''}.</p>
          <p>Your account has been successfully created, and you can now access all the features of our platform.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${process.env.FRONTEND_URL || 'https://dashboard.onealbania.al'}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Dashboard</a>
          </div>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Thank you,<br>ONE Albania Team</p>
        </div>
      \`;
      
      // Send email
      return await this.sendEmail({
        to: email,
        subject,
        body,
        isHtml: true
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Send billing notification email
   * @param {Object} billingData - Billing data
   * @returns {Promise<Object>} Send result
   */
  async sendBillingNotificationEmail(billingData) {
    try {
      const { email, companyName, invoiceNumber, amount, dueDate, invoiceUrl } = billingData;
      
      // Format date
      const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Create email content
      const subject = \`ONE Albania - Invoice #\${invoiceNumber} Ready\`;
      const body = \`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Invoice Available</h2>
          <p>Hello \${companyName},</p>
          <p>Your new invoice #\${invoiceNumber} is now available.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Invoice Number:</strong> \${invoiceNumber}</p>
            <p><strong>Amount:</strong> €\${amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> \${formattedDueDate}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="\${invoiceUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Invoice</a>
          </div>
          <p>If you have any questions about this invoice, please contact our billing department.</p>
          <p>Thank you,<br>ONE Albania Team</p>
        </div>
      \`;
      
      // Send email
      return await this.sendEmail({
        to: email,
        subject,
        body,
        isHtml: true
      });
    } catch (error) {
      console.error('Error sending billing notification email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export a singleton instance
export default new EmailService();
