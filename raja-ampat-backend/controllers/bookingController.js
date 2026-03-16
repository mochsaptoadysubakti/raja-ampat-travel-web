const Booking = require('../models/bookingModel');

const createNewBooking = async (req, res) => {
    const { user_id, package_id, booking_date, total_people, total_price } = req.body;
    try {
        const newBooking = await Booking.createBooking(user_id, package_id, booking_date, total_people, total_price);
        res.status(201).json({ message: "Booking successful", booking: newBooking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookingsByUser = async (req, res) => {
    try {
        const bookings = await Booking.getUserBookings(req.params.userId);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createNewBooking, getBookingsByUser };