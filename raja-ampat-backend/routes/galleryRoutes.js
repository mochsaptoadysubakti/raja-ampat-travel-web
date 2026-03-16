const express = require('express');
const router = express.Router();
const { getAllGalleryImages } = require('../controllers/galleryController');

router.get('/', getAllGalleryImages);

module.exports = router;