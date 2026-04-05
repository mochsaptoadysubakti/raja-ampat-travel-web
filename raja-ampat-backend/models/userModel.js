const pool = require('../config/db');

const getAllUsers = async () => {
    const result = await pool.query('SELECT id, name, email, phone, role, created_at FROM users');
    return result.rows;
};

// 1. Ditambahkan parameter 'role' di sini dan di query SQL
const createUser = async (name, email, password, phone, role) => {
    const result = await pool.query(
        'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
        [name, email, password, phone, role]
    );
    return result.rows[0];
};

// 2. Fungsi BARU untuk mengecek email saat Login
const findByEmail = async (email) => {
    // Pakai SELECT * agar field password yang di-hash ikut terambil untuk dicocokkan
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0]; // Mengembalikan data user jika ada, atau 'undefined' jika tidak ada
};

// 3. Fungsi BARU untuk menghapus user
const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Jangan lupa mengekspor semua fungsi yang sudah dibuat
module.exports = { getAllUsers, createUser, findByEmail, deleteUser };