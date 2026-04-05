const express = require('express');
const router = express.Router();
const { getDestinations, addDestination, updateDestination, deleteDestination } = require('../controllers/destinationController');

router.get('/', getDestinations);
router.post('/', addDestination);
router.put('/:id', updateDestination);
router.delete('/:id', deleteDestination);

module.exports = router;