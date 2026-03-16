// routes/destinationRoutes.js
const express = require('express');
const router = express.Router();
const { getDestinations, getSingleDestination } = require('../controllers/destinationController');

router.get('/', getDestinations);
router.get('/:id', getSingleDestination);

module.exports = router;