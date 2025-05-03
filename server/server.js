const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupSwagger } = require('./config/swagger');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const telecomRoutes = require('./routes/telecom.routes');
const costControlRoutes = require('./routes/costControl.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const serviceManagementRoutes = require('./routes/serviceManagement.routes');
const aiRecommendationsRoutes = require('./routes/aiRecommendations.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const usageHistoryRoutes = require('./routes/usageHistory.routes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ONE Albania SME Dashboard API.' });
});

// Setup Swagger documentation
setupSwagger(app);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/telecom', telecomRoutes);
app.use('/api/cost-control', costControlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/service-management', serviceManagementRoutes);
app.use('/api/ai-recommendations', aiRecommendationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/usage-history', usageHistoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
