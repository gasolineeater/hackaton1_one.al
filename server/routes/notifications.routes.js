const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Placeholder route for notifications
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Notifications API endpoint - To be implemented' });
});

module.exports = router;
