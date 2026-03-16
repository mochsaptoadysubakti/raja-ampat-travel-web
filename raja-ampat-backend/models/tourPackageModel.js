// models/tourPackageModel.js
const pool = require('../config/db');

const getAllPackages = async () => {
    const result = await pool.query('SELECT * FROM tour_packages ORDER BY created_at DESC');
    return result.rows;
};

// Mengambil detail paket SEKALIGUS dengan itinerary-nya
const getPackageDetails = async (id) => {
    const packageResult = await pool.query('SELECT * FROM tour_packages WHERE id = $1', [id]);
    const itineraryResult = await pool.query(`
        SELECT i.day, i.description, d.name AS destination_name 
        FROM itinerary i 
        LEFT JOIN destinations d ON i.destination_id = d.id 
        WHERE i.package_id = $1 
        ORDER BY i.day ASC
    `, [id]);

    if (packageResult.rows.length === 0) return null;

    return {
        ...packageResult.rows[0],
        itinerary: itineraryResult.rows
    };
};

module.exports = { getAllPackages, getPackageDetails };