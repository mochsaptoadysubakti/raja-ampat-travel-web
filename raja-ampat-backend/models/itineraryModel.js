const pool = require('../config/db');

// 1. Ambil Itinerary berdasarkan ID Paket (Untuk User melihat detail paket)
const getItineraryByPackage = async (packageId) => {
    const result = await pool.query(`
        SELECT i.id, i.day_number, i.activity, d.name AS destination_name 
        FROM itinerary i
        LEFT JOIN destinations d ON i.destination_id = d.id
        WHERE i.package_id = $1 ORDER BY i.day_number ASC
    `, [packageId]);
    return result.rows;
};

// 2. Ambil SEMUA Itinerary (Untuk Admin)
const getAllItineraries = async () => {
    const result = await pool.query(`
        SELECT i.id, i.package_id, i.day_number, i.activity, d.name AS destination_name
        FROM itinerary i
        LEFT JOIN destinations d ON i.destination_id = d.id
        ORDER BY i.id ASC
    `);
    return result.rows;
};

// 3. Tambah Itinerary Baru (POST)
const addItinerary = async (packageId, dayNumber, destinationId, activity) => {
    const result = await pool.query(
        `INSERT INTO itinerary (package_id, day_number, destination_id, activity) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [packageId, dayNumber, destinationId, activity]
    );
    return result.rows[0];
};

// 4. Hapus Itinerary (DELETE)
const deleteItinerary = async (id) => {
    const result = await pool.query(
        'DELETE FROM itinerary WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

module.exports = { 
    getItineraryByPackage,
    getAllItineraries,
    addItinerary,
    deleteItinerary
};