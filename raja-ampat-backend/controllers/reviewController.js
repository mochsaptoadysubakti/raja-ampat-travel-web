const Review = require('../models/reviewModel');

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.getAllReviews();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addReview = async (req, res) => {
    try {
        const { user_id, package_id, rating, comment } = req.body;

        // Validasi
        if (!user_id || !package_id || !rating || !comment) {
            return res.status(400).json({ error: "Semua data review wajib diisi!" });
        }

        const newReview = await Review.addReview(user_id, package_id, rating, comment);
        
        res.status(201).json({
            message: "Review berhasil ditambahkan!",
            data: newReview
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllReviews,
    addReview
};