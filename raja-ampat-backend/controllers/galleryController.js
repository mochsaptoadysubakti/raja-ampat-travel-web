const pool = require('../config/db'); // Sesuaikan letak file db.js kamu

// 1. TAMPILKAN DATA (GET)
const getAllGalleryImages = async (req, res) => {
  try {
    // Perhatikan: Pakai tabel 'gallery' (bukan galleries)
    const allGallery = await pool.query('SELECT * FROM gallery ORDER BY id DESC');
    res.json(allGallery.rows);
  } catch (err) {
    console.error("Error GET:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 2. TAMBAH DATA (POST)
const addGalleryImage = async (req, res) => {
  try {
    // Perhatikan: Tangkap title, image, description
    const { title, image, description } = req.body;
    
    // Perhatikan: Insert ke tabel 'gallery' dengan kolom yang benar
    const newGallery = await pool.query(
      'INSERT INTO gallery (title, image, description) VALUES ($1, $2, $3) RETURNING *',
      [title, image, description]
    );
    res.json(newGallery.rows[0]);
  } catch (err) {
    console.error("Error POST:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. EDIT DATA (PUT)
const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, description } = req.body;

    await pool.query(
      'UPDATE gallery SET title = $1, image = $2, description = $3 WHERE id = $4',
      [title, image, description, id]
    );
    res.json({ message: "Data berhasil diupdate!" });
  } catch (err) {
    console.error("Error PUT:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 4. HAPUS DATA (DELETE)
const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    // Perhatikan: Delete dari tabel 'gallery'
    await pool.query('DELETE FROM gallery WHERE id = $1', [id]);
    res.json({ message: "Foto galeri berhasil dihapus!" });
  } catch (err) {
    console.error("Error DELETE:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { 
  getAllGalleryImages, 
  addGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage 
};