const pool = require('../config/db');

const getItineraryByPackage = async (packageId) => {
    const result = await pool.query(`
        SELECT i.id, i.day, i.description, d.name AS destination_name 
        FROM itinerary i
        LEFT JOIN destinations d ON i.destination_id = d.id
        WHERE i.package_id = $1 ORDER BY i.day ASC
    `, [packageId]);
    return result.rows;
};

module.exports = { getItineraryByPackage };