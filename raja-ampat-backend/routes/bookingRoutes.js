const express = require('express');
const router = express.Router();
const { getBookings, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');

router.get('/', getBookings);
router.put('/:id/status', updateBookingStatus); // Rute khusus ubah status
router.delete('/:id', deleteBooking);

module.exports = router;