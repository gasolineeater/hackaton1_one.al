# ONE Albania SME Dashboard API

This is the backend API for the ONE Albania SME Dashboard, powered by Google's Gemini API.

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   cd api
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
4. Add your Gemini API key to the `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Set up the MySQL database:
   - Create a MySQL database named `one_albania_db`
   - Update the database credentials in the `.env` file:
     ```
     DB_HOST=localhost
     DB_PORT=3306
     DB_NAME=one_albania_db
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     ```
   - You can use the SQL script in `scripts/create_database.sql` to create the database and tables:
     ```
     mysql -u root -p < scripts/create_database.sql
     ```
   - Or let Sequelize create the tables automatically when you start the server
6. Initialize the database:
   ```
   npm run db:init
   ```
7. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Services

- `GET /api/services` - Get all telecom services
- `GET /api/services/:id` - Get a specific service by ID
- `GET /api/services/compare?ids=1,2,3` - Compare multiple services

### Costs

- `GET /api/costs/overview?period=monthly&companySize=medium` - Get cost overview
- `GET /api/costs/forecast?months=6` - Get cost forecast
- `GET /api/costs/optimization?budget=1000&priority=balanced` - Get cost optimization recommendations

### Analytics

- `GET /api/analytics/usage?customerId=1&period=monthly&serviceType=all&groupBy=service` - Get usage analytics
- `GET /api/analytics/cost?customerId=1&period=monthly&serviceType=all&groupBy=service` - Get cost analytics
- `GET /api/analytics/performance?customerId=1&serviceIds=1,2,3` - Get performance analytics
- `GET /api/analytics/optimization?customerId=1&threshold=50` - Get cost optimization recommendations
- `GET /api/analytics/dashboard?customerId=1` - Get dashboard summary data
- `GET /api/analytics/roi?serviceId=1&timeframe=12months` - Get ROI analysis

All analytics endpoints support the `useAI=true` parameter to get AI-generated data instead of database data.

### Recommendations

- `GET /api/recommendations/services?customerId=1&businessType=retail&employeeCount=50&budget=2000&useAI=false` - Get service recommendations
- `GET /api/recommendations/patterns?customerId=1&period=3&serviceType=all&useAI=true` - Get usage pattern analysis
- `GET /api/recommendations/optimization?customerId=1&optimizationGoal=cost&threshold=50&useAI=false` - Get cost optimization recommendations
- `GET /api/recommendations/forecast?customerId=1&timeframe=3&confidenceLevel=medium&serviceType=all&useAI=true` - Get future service needs predictions
- `GET /api/recommendations/bundles?customerId=1&budget=2000&priorities=cost,performance&useAI=true` - Get recommended service bundles
- `GET /api/recommendations/segments` - Get customer segmentation (admin only)
- `GET /api/recommendations/future?industryType=healthcare&timeframe=medium` - Get future technology recommendations

All recommendation endpoints support the `useAI=true` parameter to enhance recommendations with AI-powered insights.

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Telecom Service Integration

- `GET /api/telecom/usage/:customerId` - Get customer usage statistics
- `GET /api/telecom/usage/realtime/:customerId` - Get real-time usage data
- `POST /api/telecom/services/activate` - Activate a service for a customer
- `POST /api/telecom/services/deactivate` - Deactivate a service
- `POST /api/telecom/services/change-plan` - Change service plan
- `GET /api/telecom/plans/:serviceType` - Get available service plans
- `POST /api/telecom/sync/:customerId` - Sync customer data with ONE Albania (admin only)

### Notification System

- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread notification count
- `POST /api/notifications/mark-read/:id` - Mark notification as read
- `POST /api/notifications/mark-all-read` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/customer/:customerId` - Get customer notifications (admin/manager)
- `POST /api/notifications/create` - Create notification (admin only)
- `POST /api/notifications/create-from-template` - Create notification from template (admin only)
- `GET /api/notifications/templates` - Get all notification templates (admin only)
- `GET /api/notifications/templates/:name` - Get notification template by name (admin only)
- `POST /api/notifications/templates` - Create notification template (admin only)
- `PUT /api/notifications/templates/:name` - Update notification template (admin only)
- `DELETE /api/notifications/templates/:name` - Delete notification template (admin only)
- `POST /api/notifications/cleanup` - Clean up old notifications (admin only)

### Database

- `GET /api/database/health` - Check database health
- `GET /api/database/stats` - Get database statistics
- `POST /api/database/sync` - Sync database (admin only)

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `.env` file

## Integration with Frontend

To integrate this API with your frontend:

1. Make sure the API server is running
2. In your frontend code, make fetch requests to the API endpoints
3. Handle the JSON responses and display them in your UI

Example:

```javascript
// Example of fetching services
async function fetchServices() {
  try {
    const response = await fetch('http://localhost:3001/api/services');
    const data = await response.json();
    if (data.status === 'success') {
      // Process the services data
      console.log(data.data);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Failed to fetch services:', error);
  }
}
```

## Error Handling

All API endpoints return responses in the following format:

- Success:
  ```json
  {
    "status": "success",
    "data": { ... }
  }
  ```

- Error:
  ```json
  {
    "status": "error",
    "message": "Error message",
    "error": "Detailed error information (only in development)"
  }
  ```

## Rate Limiting

The API includes rate limiting to prevent abuse. By default, it allows 100 requests per minute per IP address. You can adjust these settings in the `.env` file.

## Database Schema

The API uses a MySQL database with the following schema:

### Customers
- Information about SME customers
- Fields: company name, business type, contact info, employee count, etc.

### Services
- Telecom services offered by ONE Albania
- Fields: name, description, category, cost, features, etc.

### Subscriptions
- Links customers to services they've subscribed to
- Fields: customer ID, service ID, start/end dates, status, etc.

### Usage
- Records of service usage by customers
- Fields: subscription ID, usage type, quantity, cost, etc.

### Billing
- Invoice information for customers
- Fields: customer ID, invoice number, dates, amounts, status, etc.

### Billing Items
- Individual line items in invoices
- Fields: billing ID, subscription ID, description, amounts, etc.

## Database Management

- **Initialize Database**: `npm run db:init`
- **Reset Database**: `npm run db:reset` (Warning: This will drop all tables and data)
- **Database Health Check**: `GET /api/database/health`
- **Database Statistics**: `GET /api/database/stats`
