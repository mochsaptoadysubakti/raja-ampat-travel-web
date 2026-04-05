const Package = require('../models/tourPackageModel');

const getPackages = async (req, res) => {
    try {
        const packages = await Package.getAllPackages();
        res.status(200).json({ data: packages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addPackage = async (req, res) => {
    // TAMBAHAN: Menerima is_available dari Frontend React
    const { title, price, duration, image_url, description, is_available, itinerary } = req.body;
    try {
        // TAMBAHAN: Mengirim is_available ke Model
        const newPkg = await Package.createPackage(title, price, duration, image_url, description, is_available, itinerary);
        res.status(201).json({ status: "success", data: newPkg });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePackage = async (req, res) => {
    // TAMBAHAN: Menerima is_available dari Frontend React
    const { title, price, duration, image_url, description, is_available, itinerary } = req.body;
    try {
        // TAMBAHAN: Mengirim is_available ke Model
        const updatedPkg = await Package.updatePackage(req.params.id, title, price, duration, image_url, description, is_available, itinerary);
        res.status(200).json({ status: "success", data: updatedPkg });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePackage = async (req, res) => {
    try {
        await Package.deletePackage(req.params.id);
        res.status(200).json({ status: "success", message: "Paket dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PASTIKAN NAMA DI SINI SAMA DENGAN YANG DI ROUTES
module.exports = { getPackages, addPackage, updatePackage, deletePackage };