// controllers/tourPackageController.js
const TourPackage = require('../models/tourPackageModel');

const getPackages = async (req, res) => {
    try {
        const packages = await TourPackage.getAllPackages();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSinglePackage = async (req, res) => {
    try {
        const pkg = await TourPackage.getPackageDetails(req.params.id);
        if (!pkg) return res.status(404).json({ message: "Package not found" });
        res.status(200).json(pkg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getPackages, getSinglePackage };