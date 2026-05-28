const express = require('express');
const router = express.Router();
const { handleNotification } = require('../controllers/paymentController');

// Jalur ini HANYA ditembak oleh server Midtrans, bukan oleh React
router.post('/webhook', handleNotification);

module.exports = router;