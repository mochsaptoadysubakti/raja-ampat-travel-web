const pool = require('../config/db');

const getAllReviews = async () => {
    // Menggunakan LEFT JOIN agar bisa mengambil nama user dan nama paket
    const query = `
        SELECT r.id, r.rating, r.comment, r.created_at, 
               u.name AS customer_name, 
               p.title AS package_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN tour_packages p ON r.package_id = p.id
        ORDER BY r.id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

const createReview = async (user_id, package_id, rating, comment) => {
    const result = await pool.query(
        'INSERT INTO reviews (user_id, package_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, package_id, rating, comment]
    );
    return result.rows[0];
};

const deleteReview = async (id) => {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { getAllReviews, createReview, deleteReview };