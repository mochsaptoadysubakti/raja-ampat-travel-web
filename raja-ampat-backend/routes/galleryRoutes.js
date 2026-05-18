const express = require('express');
const router = express.Router();

// Import SEMUA fungsi dari controller (pastikan updateGalleryImage ikut masuk!)
const { 
  getAllGalleryImages, 
  addGalleryImage, 
  updateGalleryImage, // <-- Ini yang tadi ketinggalan
  deleteGalleryImage 
} = require('../controllers/galleryController');

// [READ] Menampilkan semua foto galeri
router.get('/', getAllGalleryImages);

// [CREATE] Menambah foto galeri baru
router.post('/', addGalleryImage);

// [UPDATE/EDIT] Mengubah foto galeri berdasarkan ID
router.put('/:id', updateGalleryImage); 

// [DELETE] Menghapus foto galeri berdasarkan ID
router.delete('/:id', deleteGalleryImage);

module.exports = router;