const pool = require('../config/db');

const getReviewsByPackage = async (packageId) => {
    const result = await pool.query(`
        SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name 
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.package_id = $1 ORDER BY r.created_at DESC
    `, [packageId]);
    return result.rows;
};

module.exports = { getReviewsByPackage };