const pool = require('../config/db');

const UserModel = {
    // 1. Mengambil semua user (Untuk halaman Admin Panel)
    getAllUsers: async () => {
        const result = await pool.query(
            'SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC'
        );
        return result.rows;
    },

    // 2. Menambah user baru (Digunakan oleh fitur Register & Admin Panel)
    createUser: async (name, email, password, phone, role) => {
        const result = await pool.query(
            'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role',
            [name, email, password, phone, role]
        );
        return result.rows[0];
    },

    // 3. Update data user (Untuk tombol Edit di Admin Panel)
    updateUser: async (id, name, email, phone, role) => {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role',
            [name, email, phone, role, id]
        );
        return result.rows[0];
    },

    // 4. Mengecek email (SANGAT PENTING untuk fitur Login & Register)
    findByEmail: async (email) => {
        // Pakai SELECT * agar field password terambil untuk dicocokkan (oleh bcrypt di controller)
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0]; 
    },

    // 5. Menghapus user (Untuk tombol Hapus di Admin Panel)
    deleteUser: async (id) => {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};

// Ekspor semua fungsi agar bisa dipanggil di Controller
module.exports = UserModel;