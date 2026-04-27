const express = require('express');
const router = express.Router();

// Import semua fungsi dari controller
const { 
  getAllGalleryImages, 
  addGalleryImage, 
  deleteGalleryImage 
} = require('../controllers/galleryController');

// [READ] Menampilkan semua foto galeri
router.get('/', getAllGalleryImages);

// [CREATE] Menambah foto galeri ulasan baru
router.post('/', addGalleryImage);

// [DELETE] Menghapus foto galeri berdasarkan ID
router.delete('/:id', deleteGalleryImage);

module.exports = router;