const Gallery = require('../models/galleryModel');

const getAllGalleryImages = async (req, res) => {
    try {
        const images = await Gallery.getGallery();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllGalleryImages };