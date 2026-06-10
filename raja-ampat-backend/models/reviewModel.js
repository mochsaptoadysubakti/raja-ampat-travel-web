const pool = require('../config/db');

// 1. Mengambil Semua Review (Untuk Admin / Halaman Depan)
const getAllReviews = async () => {
    const result = await pool.query(`
        SELECT 
            r.id, 
            r.user_id,
            r.package_id,
            u.name AS customer_name,  -- Diubah agar cocok dengan Frontend Admin
            u.email AS customer_email, -- Ditambahkan agar email muncul di Admin
            p.title AS package_name, 
            r.rating, 
            r.comment, 
            r.created_at 
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN tour_packages p ON r.package_id = p.id
        ORDER BY r.created_at DESC
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