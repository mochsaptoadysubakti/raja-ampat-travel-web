const pool = require('../config/db'); // Sesuaikan letak file db.js kamu

// 1. TAMPILKAN DATA (GET)
const getAllGalleryImages = async (req, res) => {
  try {
    const allGallery = await pool.query('SELECT * FROM gallery ORDER BY id DESC');
    // Frontend berekspektasi ada properti .data, jadi kita bungkus hasilnya
    res.status(200).json({ data: allGallery.rows }); 
  } catch (err) {
    console.error("Error GET:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 2. TAMBAH DATA (POST)
const addGalleryImage = async (req, res) => {
  try {
    // Tangkap dari frontend
    const { title, image, image_url, description } = req.body;
    
    // Fleksibel: pakai image atau image_url
    const finalImage = image || image_url; 
    
    const newGallery = await pool.query(
      'INSERT INTO gallery (title, image, description) VALUES ($1, $2, $3) RETURNING *',
      [title, finalImage, description]
    );
    res.status(201).json({ message: "Berhasil ditambahkan", data: newGallery.rows[0] });
  } catch (err) {
    console.error("Error POST:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. EDIT DATA (PUT)
const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, image_url, description } = req.body;
    
    const finalImage = image || image_url;

    // Cek dulu apakah ID-nya ada di database
    const check = await pool.query('SELECT * FROM gallery WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Data Galeri tidak ditemukan di database" });
    }

    const updatedGallery = await pool.query(
      'UPDATE gallery SET title = $1, image = $2, description = $3 WHERE id = $4 RETURNING *',
      [title, finalImage, description, id]
    );
    res.status(200).json({ message: "Data berhasil diupdate!", data: updatedGallery.rows[0] });
  } catch (err) {
    console.error("Error PUT:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 4. HAPUS DATA (DELETE)
const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM gallery WHERE id = $1', [id]);
    res.status(200).json({ message: "Foto galeri berhasil dihapus!" });
  } catch (err) {
    console.error("Error DELETE:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Export semua fungsi yang benar
module.exports = { 
  getAllGalleryImages, 
  addGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage 
};