const pool = require('../config/db');

// 1. Mengambil Semua Review (Untuk Admin / Halaman Depan)
const getAllReviews = async () => {
    const result = await pool.query(`
        SELECT r.id, u.name AS user_name, p.title AS package_name, 
               r.rating, r.comment, r.created_at 
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN tour_packages p ON r.package_id = p.id
        ORDER BY r.id DESC
    `);
    return result.rows;
};

// 2. Menambahkan Review Baru (POST)
const addReview = async (userId, packageId, rating, comment) => {
    // created_at biasanya terisi otomatis oleh PostgreSQL (default: NOW())
    const result = await pool.query(
        `INSERT INTO reviews (user_id, package_id, rating, comment) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [userId, packageId, rating, comment]
    );
    return result.rows[0];
};

module.exports = {
    getAllReviews,
    addReview
};