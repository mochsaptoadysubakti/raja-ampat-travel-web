const express = require('express');
const router = express.Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');

router.get('/', getReviews);
router.post('/', addReview);
router.delete('/:id', deleteReview);

module.exports = router;