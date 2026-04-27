const pool = require('../config/db');

// 1. Mengambil semua user (Biasanya diurutkan dari yang terbaru/id DESC)
const getAllUsers = async () => {
    const result = await pool.query(
        'SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC'
    );
    return result.rows;
};

// 2. Menambah user baru (Sesuai kolom database kamu)
const createUser = async (name, email, password, phone, role) => {
    const result = await pool.query(
        'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role',
        [name, email, password, phone, role]
    );
    return result.rows[0];
};

// 3. Update data user (PENTING: Agar tombol Edit di React kamu berfungsi)
const updateUser = async (id, name, email, phone, role) => {
    const result = await pool.query(
        'UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role',
        [name, email, phone, role, id]
    );
    return result.rows[0];
};

// 4. Mengecek email (Untuk proses Login/Autentikasi)
const findByEmail = async (email) => {
    // Pakai SELECT * agar field password terambil untuk dicocokkan (bcrypt)
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0]; 
};

// 5. Menghapus user
const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Ekspor semua fungsi agar bisa dipanggil di Controller
module.exports = { 
    getAllUsers, 
    createUser, 
    updateUser, 
    findByEmail, 
    deleteUser 
};