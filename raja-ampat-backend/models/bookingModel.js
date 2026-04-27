const pool = require('../config/db');

// 1. Mengambil Semua Pesanan
const getAllBookings = async () => {
    const result = await pool.query(`
        SELECT b.id, u.name AS user_name, p.title AS package_name, 
               b.booking_date, b.total_people, b.total_price, b.status 
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN tour_packages p ON b.package_id = p.id
        ORDER BY b.id DESC
    `);
    return result.rows;
};

// 2. Membuat Pesanan Baru (POST)
const createBooking = async (userId, packageId, bookingDate, totalPeople, totalPrice) => {
    const result = await pool.query(
        `INSERT INTO bookings (user_id, package_id, booking_date, total_people, total_price, status) 
         VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
        [userId, packageId, bookingDate, totalPeople, totalPrice]
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

module.exports = {
    getAllBookings,
    createBooking,
    updateBookingStatus
};