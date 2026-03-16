const Review = require('../models/reviewModel');

const getPackageReviews = async (req, res) => {
    try {
        const reviews = await Review.getReviewsByPackage(req.params.packageId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getPackageReviews };