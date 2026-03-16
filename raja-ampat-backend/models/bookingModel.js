const pool = require('../config/db');

const createBooking = async (user_id, package_id, booking_date, total_people, total_price) => {
    const result = await pool.query(
        'INSERT INTO bookings (user_id, package_id, booking_date, total_people, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, package_id, booking_date, total_people, total_price]
    );
    return result.rows[0];
};

const getUserBookings = async (user_id) => {
    const result = await pool.query(`
        SELECT b.*, t.title AS package_title 
        FROM bookings b
        JOIN tour_packages t ON b.package_id = t.id
        WHERE b.user_id = $1 ORDER BY b.booking_date DESC
    `, [user_id]);
    return result.rows;
};

module.exports = { createBooking, getUserBookings };