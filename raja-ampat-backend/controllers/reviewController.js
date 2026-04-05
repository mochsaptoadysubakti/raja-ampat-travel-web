const Review = require('../models/reviewModel');

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.getAllReviews();
        res.status(200).json({ data: reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addReview = async (req, res) => {
    // Menyesuaikan dengan kolom database kamu
    const { user_id, package_id, rating, comment } = req.body;
    try {
        const newReview = await Review.createReview(user_id, package_id, rating, comment);
        res.status(201).json({ status: "success", data: newReview, message: "Review berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.deleteReview(req.params.id);
        if (!deletedReview) return res.status(404).json({ message: "Review tidak ditemukan" });
        res.status(200).json({ status: "success", message: "Review berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getReviews, addReview, deleteReview };