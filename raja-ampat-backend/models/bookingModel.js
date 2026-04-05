const pool = require('../config/db');

const getAllBookings = async () => {
    // Mengambil semua data booking, diurutkan dari yang terbaru
    // Catatan: Jika tidak ada kolom 'id', ubah ORDER BY sesuai nama kolom primary key-mu
    const result = await pool.query('SELECT * FROM bookings ORDER BY id DESC');
    return result.rows;
};

const updateStatus = async (id, status) => {
    // Fungsi untuk mengubah status pesanan (misal: pending -> confirmed)
    const result = await pool.query(
        'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    return result.rows[0];
};

const deleteBooking = async (id) => {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { getAllBookings, updateStatus, deleteBooking };