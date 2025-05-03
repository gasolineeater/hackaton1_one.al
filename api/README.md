# ONE Albania SME Dashboard API

Backend API for the ONE Albania SME Dashboard, providing telecom service management, analytics, and recommendations.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication system
- **Service Management**: Endpoints for managing telecom services
- **Analytics Engine**: Data aggregation and visualization endpoints
- **Cost Optimization**: Intelligent cost optimization recommendations
- **Recommendation System**: AI-powered service recommendations
- **Notification System**: Multi-channel notification delivery (in-app, email, SMS)
- **Telecom Integration**: Integration with ONE Albania's telecom services

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MySQL**: Database
- **Sequelize**: ORM for database operations
- **JWT**: Authentication
- **Winston**: Logging
- **Nodemailer**: Email delivery
- **Google Gemini API**: AI capabilities

## Prerequisites

- Node.js (v16+)
- MySQL (v8+)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/one-albania-api.git
   cd one-albania-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Database credentials
   - JWT secret
   - API keys
   - Email/SMS settings

5. Initialize the database:
   ```
   npm run db:init
   ```

6. Create an admin user:
   ```
   npm run create:admin
   ```

7. (Optional) Create sample data:
   ```
   npm run create:samples
   ```

8. (Optional) Initialize notification templates:
   ```
   npm run init:notifications
   ```

## Running the Application

### Development Mode

```
npm run dev
```

### Production Mode

```
npm start
```

## API Documentation

API documentation is available at `/api/docs` when the server is running.

A comprehensive list of endpoints is available in the `API_README.md` file.

## Testing

The API includes a built-in testing interface available at `/test.html` when the server is running.

## Scripts

- `npm start`: Start the server in production mode
- `npm run dev`: Start the server in development mode with auto-reload
- `npm run db:init`: Initialize the database
- `npm run db:reset`: Reset the database (warning: deletes all data)
- `npm run create:admin`: Create an admin user
- `npm run create:samples`: Create sample data
- `npm run init:notifications`: Initialize notification templates
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Run ESLint and fix issues

## Security

This API implements several security best practices:

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Error sanitization

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For support or inquiries, please contact support@onealbania.al.
