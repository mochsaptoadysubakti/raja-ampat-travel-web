const express = require('express');
const router = express.Router();

// PERHATIKAN: Pastikan nama file di dalam require() sama persis huruf besar/kecilnya
const { 
    getAllBookings, 
    createBooking, 
    updateBookingStatus 
} = require('../controllers/bookingController');

// Mengambil semua data pemesanan
router.get('/', getAllBookings);

// Membuat pemesanan baru
router.post('/', createBooking);

// Mengupdate status pemesanan
router.put('/:id/status', updateBookingStatus);

module.exports = router;