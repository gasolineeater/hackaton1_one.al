# ONE Albania SME Dashboard API Guide

This guide provides comprehensive documentation for the ONE Albania SME Dashboard API, including authentication, endpoints, and usage examples.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)
5. [Testing](#testing)
6. [Monitoring](#monitoring)
7. [Best Practices](#best-practices)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
4. Initialize the database:
   ```bash
   npm run db:init
   ```
5. Start the server:
   ```bash
   npm start
   ```

### Development Mode

```bash
npm run dev
```

## Authentication

The API uses JWT (JSON Web Token) for authentication.

### Registration

```
POST /api/auth/register
```

Request body:
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "expiresIn": "15m"
    }
  }
}
```

### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "john.doe@example.com",
  "password": "Password123"
}
```

Response:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "expiresIn": "15m"
    }
  }
}
```

### Refresh Token

```
POST /api/auth/refresh-token
```

Request body:
```json
{
  "refreshToken": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
}
```

Response:
```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "q7r8s9t0-u1v2-w3x4-y5z6-a7b8c9d0e1f2",
      "expiresIn": "15m"
    }
  }
}
```

### Logout

```
POST /api/auth/logout
```

Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request body:
```json
{
  "refreshToken": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
}
```

Response:
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

## API Endpoints

### Recommendations

#### Get Service Recommendations

```
GET /api/recommendations/services?customerId=1&businessType=retail&employeeCount=50&budget=2000&useAI=false
```

Parameters:
- `customerId` (required): Customer ID
- `businessType`: Type of business (retail, healthcare, manufacturing, etc.)
- `employeeCount`: Number of employees
- `budget`: Monthly budget in EUR
- `useAI`: Whether to use AI for enhanced recommendations (true/false)

Response:
```json
{
  "status": "success",
  "data": {
    "currentServices": [
      {
        "id": 1,
        "name": "Business Internet",
        "description": "High-speed internet for businesses",
        "type": "internet",
        "price": 49.99
      }
    ],
    "recommendations": [
      {
        "id": 2,
        "name": "Business Phone",
        "description": "Phone service for businesses",
        "type": "phone",
        "price": 29.99,
        "score": 0.85,
        "reason": "Complements your existing internet service"
      }
    ]
  }
}
```

#### Get Usage Pattern Analysis

```
GET /api/recommendations/patterns?customerId=1&period=3&serviceType=all&useAI=true
```

Parameters:
- `customerId` (required): Customer ID
- `period`: Analysis period in months (default: 3)
- `serviceType`: Type of service to analyze (all, internet, voice, mobile, cloud, iot)
- `useAI`: Whether to use AI for enhanced analysis (true/false)

Response:
```json
{
  "status": "success",
  "data": {
    "usageFeatures": {
      "dataUsage": {
        "average": 250.5,
        "trend": "increasing",
        "peakTimes": ["Monday", "Friday"]
      },
      "callMinutes": {
        "average": 320.75,
        "trend": "stable",
        "peakTimes": ["Tuesday", "Thursday"]
      }
    },
    "anomalies": {
      "anomalies": [
        {
          "date": "2023-11-15",
          "metric": "dataUsage",
          "value": 500.25,
          "expected": 260.0,
          "deviation": 92.4
        }
      ]
    },
    "predictions": {
      "predictions": [
        {
          "date": "2023-12-01",
          "metric": "dataUsage",
          "value": 275.5,
          "confidence": 0.85
        }
      ]
    }
  }
}
```

#### Get Cost Optimization Recommendations

```
GET /api/recommendations/optimization?customerId=1&optimizationGoal=cost&threshold=50&useAI=false
```

Parameters:
- `customerId` (required): Customer ID
- `optimizationGoal`: Optimization goal (cost, performance, efficiency, balanced)
- `threshold`: Utilization threshold percentage (default: 50)
- `useAI`: Whether to use AI for enhanced recommendations (true/false)

Response:
```json
{
  "status": "success",
  "data": {
    "utilizationBySubscription": [
      {
        "subscriptionId": 1,
        "serviceId": 3,
        "serviceName": "Business Mobile",
        "utilization": 35.5,
        "cost": 99.99
      }
    ],
    "recommendations": [
      {
        "subscriptionId": 1,
        "serviceId": 3,
        "recommendation": "downgrade",
        "currentPlan": "Premium",
        "recommendedPlan": "Standard",
        "potentialSavings": 40.00,
        "reason": "Low utilization (35.5%) of premium features"
      }
    ],
    "totalPotentialSavings": 40.00
  }
}
```

### Services

#### Get Services

```
GET /api/services
```

Response:
```json
{
  "status": "success",
  "data": {
    "services": [
      {
        "id": 1,
        "name": "Business Internet",
        "description": "High-speed internet for businesses",
        "type": "internet",
        "price": 49.99,
        "features": ["100 Mbps", "Static IP", "24/7 Support"]
      },
      {
        "id": 2,
        "name": "Business Phone",
        "description": "Phone service for businesses",
        "type": "phone",
        "price": 29.99,
        "features": ["Unlimited Calls", "Voicemail", "Call Forwarding"]
      }
    ]
  }
}
```

#### Get Customer Subscriptions

```
GET /api/services/subscriptions?customerId=1
```

Parameters:
- `customerId` (required): Customer ID

Response:
```json
{
  "status": "success",
  "data": {
    "subscriptions": [
      {
        "id": 1,
        "customerId": 1,
        "serviceId": 1,
        "status": "active",
        "startDate": "2023-01-01T00:00:00.000Z",
        "endDate": null,
        "service": {
          "id": 1,
          "name": "Business Internet",
          "description": "High-speed internet for businesses",
          "type": "internet",
          "price": 49.99
        }
      }
    ]
  }
}
```

### Analytics

#### Get Usage Analytics

```
GET /api/analytics/usage?customerId=1&period=3&serviceType=all
```

Parameters:
- `customerId` (required): Customer ID
- `period`: Analysis period in months (default: 3)
- `serviceType`: Type of service to analyze (all, internet, voice, mobile, cloud, iot)

Response:
```json
{
  "status": "success",
  "data": {
    "usageByDay": [
      {
        "date": "2023-11-01",
        "dataUsage": 250.5,
        "callMinutes": 320.75,
        "smsCount": 45
      }
    ],
    "usageByService": [
      {
        "serviceId": 1,
        "serviceName": "Business Internet",
        "dataUsage": 7500.25,
        "percentage": 85.5
      }
    ],
    "totalUsage": {
      "dataUsage": 8771.5,
      "callMinutes": 9622.5,
      "smsCount": 1350
    }
  }
}
```

#### Get Cost Analytics

```
GET /api/analytics/costs?customerId=1&period=3
```

Parameters:
- `customerId` (required): Customer ID
- `period`: Analysis period in months (default: 3)

Response:
```json
{
  "status": "success",
  "data": {
    "costsByMonth": [
      {
        "month": "2023-09",
        "total": 149.97,
        "breakdown": [
          {
            "serviceId": 1,
            "serviceName": "Business Internet",
            "cost": 49.99
          },
          {
            "serviceId": 2,
            "serviceName": "Business Phone",
            "cost": 29.99
          },
          {
            "serviceId": 3,
            "serviceName": "Business Mobile",
            "cost": 69.99
          }
        ]
      }
    ],
    "costsByService": [
      {
        "serviceId": 1,
        "serviceName": "Business Internet",
        "totalCost": 149.97,
        "percentage": 33.33
      }
    ],
    "totalCost": 449.91
  }
}
```

## Error Handling

The API uses consistent error responses:

```json
{
  "status": "error",
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

### API Testing Tool

The API includes a built-in testing tool available at:

```
http://localhost:3001/test.html
```

## Monitoring

### Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2023-12-01T12:00:00.000Z",
  "environment": "development"
}
```

### Metrics

```
GET /metrics
```

Response: Prometheus-formatted metrics

### Monitoring Server

A dedicated monitoring server is available at:

```
http://localhost:9090
```

Endpoints:
- `/metrics`: Prometheus metrics
- `/health`: Detailed health check
- `/system`: System information
- `/logs`: Log files information

## Best Practices

1. **Authentication**: Always include the JWT token in the Authorization header for authenticated endpoints.
2. **Rate Limiting**: The API implements rate limiting to prevent abuse. Handle 429 Too Many Requests responses appropriately.
3. **Caching**: The API implements caching for expensive operations. Use the appropriate cache headers in your requests.
4. **Error Handling**: Always check the status field in responses to determine success or failure.
5. **Validation**: Validate input data before sending requests to avoid 400 Bad Request errors.
6. **Monitoring**: Use the monitoring endpoints to track API performance and health.
7. **Testing**: Write tests for your client applications to ensure compatibility with the API.

## Support

For support, please contact:
- Email: support@onealbania.al
- Phone: +355 123 456 789
