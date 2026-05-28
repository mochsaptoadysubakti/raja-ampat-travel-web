const pool = require('../config/db');

// 1. Mengambil Semua Pesanan (Termasuk data Midtrans untuk Admin)
const getAllBookings = async () => {
    const result = await pool.query(`
        SELECT b.id, 
               u.name AS user_name, 
               u.email AS user_email, 
               u.phone AS user_phone, 
               p.title AS package_name, 
               b.booking_date, 
               b.total_people, 
               b.total_price, 
               b.status,
               b.midtrans_order_id,
               b.payment_type,
               b.snap_token
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN tour_packages p ON b.package_id = p.id
        ORDER BY b.id DESC
    `);
    return result.rows;
};

// 2. Membuat Pesanan Baru (POST - Terintegrasi dengan Midtrans)
const createBooking = async (userId, packageId, bookingDate, totalPeople, totalPrice, midtransOrderId, snapToken) => {
    const result = await pool.query(
        `INSERT INTO bookings (user_id, package_id, booking_date, total_people, total_price, midtrans_order_id, snap_token, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
        [userId, packageId, bookingDate, totalPeople, totalPrice, midtransOrderId, snapToken]
    );
    return result.rows[0];
};

// 3. Mengubah Status Pesanan (PUT)
const updateBookingStatus = async (id, status) => {
    const result = await pool.query(
        'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    return result.rows[0];
};

// 4. Mengambil Pesanan Berdasarkan ID User
const getBookingsByUserId = async (userId) => {
    // b.* otomatis ikut mengambil kolom baru (midtrans_order_id, payment_type, snap_token)
    const query = `
        SELECT b.*, p.title as tour_name 
        FROM bookings b
        LEFT JOIN tour_packages p ON b.package_id = p.id
        WHERE b.user_id = $1
        ORDER BY b.booking_date DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

module.exports = { 
    getAllBookings, 
    getBookingsByUserId, 
    createBooking, 
    updateBookingStatus 
};