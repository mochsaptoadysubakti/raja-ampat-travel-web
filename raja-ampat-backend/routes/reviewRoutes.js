const express = require('express');
const router = express.Router();
const { getAllReviews, addReview } = require('../controllers/reviewController');

// GET semua review
router.get('/', getAllReviews);

// POST review baru
router.post('/', addReview);

module.exports = router;