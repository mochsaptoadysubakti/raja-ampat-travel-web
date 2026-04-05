const Booking = require('../models/bookingModel');

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.getAllBookings();
        res.status(200).json({ data: bookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const updatedBooking = await Booking.updateStatus(req.params.id, status);
        if (!updatedBooking) return res.status(404).json({ message: "Booking tidak ditemukan" });
        res.status(200).json({ status: "success", data: updatedBooking, message: "Status berhasil diubah!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking.deleteBooking(req.params.id);
        if (!deletedBooking) return res.status(404).json({ message: "Booking tidak ditemukan" });
        res.status(200).json({ status: "success", message: "Booking berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getBookings, updateBookingStatus, deleteBooking };