const Booking = require('../models/bookingModel');
const midtransClient = require('midtrans-client');
require('dotenv').config();

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

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
        // Tambahan: Ambil juga customer_name & customer_email dari frontend jika ada
        const { user_id, package_id, booking_date, total_people, total_price, customer_name, customer_email } = req.body;

        // Validasi data dasar
        if (!user_id || !package_id || !booking_date || !total_people || !total_price) {
            return res.status(400).json({ error: "Semua data pemesanan wajib diisi!" });
        }

        // 1. Buat Order ID Unik untuk Midtrans
        const midtransOrderId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 2. Siapkan parameter untuk dikirim ke Midtrans
        const parameter = {
            transaction_details: {
                order_id: midtransOrderId,
                gross_amount: Math.round(total_price)
            },
            customer_details: {
                first_name: customer_name || 'Customer', // Fallback jika frontend belum ngirim nama
                email: customer_email || 'customer@example.com' // Fallback jika frontend belum ngirim email
            }
        };

        // 3. Minta Token ke Midtrans
        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        // 4. Simpan ke database menggunakan Model
        // PERHATIKAN: Kita menambahkan midtransOrderId dan snapToken ke dalam argumen model
        const newBooking = await Booking.createBooking(
            user_id, 
            package_id, 
            booking_date, 
            total_people, 
            total_price, 
            midtransOrderId, 
            snapToken
        );
        
        // 5. Kirim respon ke Frontend (React) beserta tokennya
        res.status(201).json({
            message: "Pesanan berhasil dibuat!",
            data: newBooking,
            token: snapToken // <--- Ini yang paling penting untuk memunculkan pop-up Midtrans di React
        });
    } catch (error) {
        console.error("Error Midtrans/Booking:", error);
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

const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.getBookingsByUserId(userId);
        res.status(200).json({ data: bookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllBookings,
    getBookingsByUser, 
    createBooking,
    updateBookingStatus
};