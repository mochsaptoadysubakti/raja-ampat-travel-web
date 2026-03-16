const express = require('express');
const router = express.Router();
const { createNewBooking, getBookingsByUser } = require('../controllers/bookingController');

router.post('/', createNewBooking);
// Mengambil riwayat booking berdasarkan ID user
router.get('/user/:userId', getBookingsByUser);

module.exports = router;