const pool = require('../config/db'); // Sesuaikan letak koneksi database-mu

const ContactModel = {
  // Mengambil semua pesan masuk
  getAll: async () => {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return result.rows;
  },

  // Menambah pesan baru (untuk form di Landing Page nanti)
  create: async (name, email, message) => {
    const result = await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    return result.rows[0];
  },

  // Menghapus pesan berdasarkan ID
  delete: async (id) => {
    await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    return true; // Kembalikan true jika berhasil
  }
};

module.exports = ContactModel;