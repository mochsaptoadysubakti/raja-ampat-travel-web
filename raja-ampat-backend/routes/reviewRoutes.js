const express = require('express');
const router = express.Router();
const { getPackageReviews } = require('../controllers/reviewController');

// Mengambil review berdasarkan ID paket wisata
router.get('/package/:packageId', getPackageReviews);

module.exports = router;