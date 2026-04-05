const pool = require('../config/db');

const getAllDestinations = async () => {
    const result = await pool.query('SELECT * FROM destinations ORDER BY id DESC');
    return result.rows;
};

const createDestination = async (name, description, image_url) => {
    // Pastikan di database nama kolom fotonya 'image_url' (atau ganti jadi 'image' kalau di DB namanya image)
    const result = await pool.query(
        'INSERT INTO destinations (name, description, image_url) VALUES ($1, $2, $3) RETURNING *',
        [name, description, image_url]
    );
    return result.rows[0];
};

const updateDestination = async (id, name, description, image_url) => {
    const result = await pool.query(
        'UPDATE destinations SET name = $1, description = $2, image_url = $3 WHERE id = $4 RETURNING *',
        [name, description, image_url, id]
    );
    return result.rows[0];
};

const deleteDestination = async (id) => {
    const result = await pool.query('DELETE FROM destinations WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { getAllDestinations, createDestination, updateDestination, deleteDestination };