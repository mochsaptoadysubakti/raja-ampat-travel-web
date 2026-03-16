const express = require('express');
const router = express.Router();
const { getPackageItinerary } = require('../controllers/itineraryController');

// Mengambil itinerary berdasarkan ID paket wisata
router.get('/:packageId', getPackageItinerary);

// INI BAGIAN YANG PALING PENTING
module.exports = router;