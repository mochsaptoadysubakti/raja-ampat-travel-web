const Booking = require('../models/bookingModel');

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.getAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBooking = async (req, res) => {
    try {
        // PERHATIKAN: total_pax diganti jadi total_people
        const { user_id, package_id, booking_date, total_people, total_price } = req.body;

        // Validasi data
        if (!user_id || !package_id || !booking_date || !total_people || !total_price) {
            return res.status(400).json({ error: "Semua data pemesanan wajib diisi!" });
        }

        const newBooking = await Booking.createBooking(user_id, package_id, booking_date, total_people, total_price);
        
        res.status(201).json({
            message: "Pesanan berhasil dibuat!",
            data: newBooking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status pemesanan harus diisi!" });
        }

        const updatedBooking = await Booking.updateBookingStatus(id, status);

        if (!updatedBooking) {
            return res.status(404).json({ error: "Pesanan tidak ditemukan!" });
        }

        res.status(200).json({
            message: "Status pesanan berhasil diperbarui!",
            data: updatedBooking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllBookings,
    createBooking,
    updateBookingStatus
};