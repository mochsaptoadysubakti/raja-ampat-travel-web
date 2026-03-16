const pool = require('../config/db');

const getGallery = async () => {
    const result = await pool.query('SELECT * FROM gallery ORDER BY id DESC');
    return result.rows;
};

module.exports = { getGallery };