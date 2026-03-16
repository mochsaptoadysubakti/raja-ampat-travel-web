const pool = require('../config/db');

const getAllBlogs = async () => {
    const result = await pool.query('SELECT * FROM blog ORDER BY created_at DESC');
    return result.rows;
};

const getBlogById = async (id) => {
    const result = await pool.query('SELECT * FROM blog WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = { getAllBlogs, getBlogById };