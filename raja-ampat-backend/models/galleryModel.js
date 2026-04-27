const pool = require('../config/db'); // Sesuaikan path koneksi database-mu

const GalleryModel = {
  // Mengambil semua data
  getAll: async () => {
    const result = await pool.query('SELECT * FROM galleries ORDER BY id DESC');
    return result.rows;
  },

  // Menambah data baru
  create: async (customer_name, photo_url, caption) => {
    const result = await pool.query(
      'INSERT INTO galleries (customer_name, photo_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [customer_name, photo_url, caption]
    );
    return result.rows[0];
  },

  // Menghapus data
  delete: async (id) => {
    await pool.query('DELETE FROM galleries WHERE id = $1', [id]);
    return true; // Kembalikan true jika berhasil
  }
};

module.exports = GalleryModel;