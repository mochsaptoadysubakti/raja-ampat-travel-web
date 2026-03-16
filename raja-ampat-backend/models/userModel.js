const pool = require('../config/db');

const getAllUsers = async () => {
    const result = await pool.query('SELECT id, name, email, phone, role, created_at FROM users');
    return result.rows;
};

const createUser = async (name, email, password, phone) => {
    const result = await pool.query(
        'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
        [name, email, password, phone]
    );
    return result.rows[0];
};

module.exports = { getAllUsers, createUser };