const express = require('express');
const router = express.Router();
const newsletterController = require('../controller/newsletter.controller');

// Subscribe to newsletter
router.post('/subscribe', newsletterController.subscribe);

// Get all subscribers (Admin - requires auth)
router.get('/subscribers', newsletterController.getAllSubscribers);

// Export subscribers to CSV (Admin - requires auth)
router.get('/export', newsletterController.exportSubscribers);

// Unsubscribe
router.post('/unsubscribe', newsletterController.unsubscribe);

// Get stats (Admin - requires auth)
router.get('/stats', newsletterController.getStats);

module.exports = router;
