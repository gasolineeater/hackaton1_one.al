# ONE Albania SME Dashboard - Backend Server

This is the backend server for the ONE Albania SME Dashboard application. It provides API endpoints for the frontend to interact with the database and perform various operations.

## 📋 Project Structure

- `config/` - Configuration files for database and environment variables
- `controllers/` - Request handlers for API endpoints
- `models/` - Database models and business logic
- `routes/` - API route definitions
- `middleware/` - Express middleware functions
- `utils/` - Utility functions and helpers
- `server.js` - Main server entry point

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL (v8 or later)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=one_albania_db
   JWT_SECRET=your_secret_key
   JWT_EXPIRATION=86400
   ```

3. Initialize the database:
   ```bash
   npm run init-db
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## 📝 API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Telecom Lines

- `GET /api/telecom/lines` - Get all telecom lines for the authenticated user
- `GET /api/telecom/lines/:id` - Get telecom line by ID
- `POST /api/telecom/lines` - Create a new telecom line
- `PUT /api/telecom/lines/:id` - Update telecom line
- `DELETE /api/telecom/lines/:id` - Delete telecom line

### Service Plans

- `GET /api/telecom/plans` - Get all service plans
- `GET /api/telecom/plans/:id` - Get service plan by ID

### AI Recommendations

- `GET /api/ai-recommendations` - Get all AI recommendations for the authenticated user
- `GET /api/ai-recommendations/:id` - Get AI recommendation by ID
- `POST /api/ai-recommendations/generate` - Generate new AI recommendations
- `PUT /api/ai-recommendations/:id/apply` - Apply AI recommendation
- `DELETE /api/ai-recommendations/:id` - Dismiss AI recommendation

### Cost Control

- Coming soon

### Analytics

- Coming soon

### Service Management

- Coming soon

### Notifications

- Coming soon
