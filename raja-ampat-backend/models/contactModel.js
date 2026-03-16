const pool = require('../config/db');

const createContact = async (name, email, message) => {
    const result = await pool.query(
        'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id',
        [name, email, message]
    );
    return result.rows[0];
};

module.exports = { createContact };