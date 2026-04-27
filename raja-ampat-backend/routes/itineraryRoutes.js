const express = require('express');
const router = express.Router();
const { 
    getPackageItinerary, 
    getAllItinerary, 
    addItinerary, 
    deleteItinerary 
} = require('../controllers/itineraryController');

// Route GET All dan POST
router.get('/', getAllItinerary);
router.post('/', addItinerary);

// Route parameter ID
router.get('/:packageId', getPackageItinerary);
router.delete('/:id', deleteItinerary);

module.exports = router;