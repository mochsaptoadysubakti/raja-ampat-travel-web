// models/destinationModel.js
const pool = require('../config/db');

const getAllDestinations = async () => {
    const result = await pool.query('SELECT * FROM destinations ORDER BY created_at DESC');
    return result.rows;
};

const getDestinationById = async (id) => {
    const result = await pool.query('SELECT * FROM destinations WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = { getAllDestinations, getDestinationById };