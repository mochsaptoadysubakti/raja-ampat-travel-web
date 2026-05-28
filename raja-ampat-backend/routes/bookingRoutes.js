const express = require('express');
const router = express.Router();
const { 
    getAllBookings, 
    getBookingsByUser, 
    createBooking, 
    updateBookingStatus 
} = require('../controllers/bookingController');

// 1. Mengambil semua data booking (Untuk Admin)
router.get('/', getAllBookings);

// 2. Mengambil riwayat booking berdasarkan ID User
router.get('/user/:userId', getBookingsByUser); 

// 3. Membuat pesanan baru + Minta Token Midtrans
router.post('/', createBooking);

// 4. Update status pesanan secara manual (Untuk Admin)
router.put('/:id', updateBookingStatus);

module.exports = router;