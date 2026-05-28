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
    // PERBAIKAN: Tangkap data included dan excluded yang dikirim dari frontend
    const { 
        title, price, duration, image_url, description, 
        is_available, is_featured, category, itinerary, 
        included, excluded 
    } = req.body;

    try {
        // Trik: Ubah array included & excluded menjadi string JSON agar tipenya COCOK dengan database TEXT/VARCHAR
        const stringIncluded = included ? JSON.stringify(included) : JSON.stringify([]);
        const stringExcluded = excluded ? JSON.stringify(excluded) : JSON.stringify([]);

        // PERBAIKAN: Teruskan stringIncluded dan stringExcluded ke fungsi di model kamu
        const newPkg = await Package.createPackage(
            title, price, duration, image_url, description, 
            is_available, is_featured, category, itinerary, 
            stringIncluded, stringExcluded
        );

        res.status(201).json({ status: "success", data: newPkg });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePackage = async (req, res) => {
    // PERBAIKAN: Tangkap data included dan excluded yang dikirim dari frontend saat proses edit
    const { 
        title, price, duration, image_url, description, 
        is_available, is_featured, category, itinerary, 
        included, excluded 
    } = req.body;

    try {
        // Trik: Ubah array menjadi string JSON untuk update ke DB
        const stringIncluded = included ? JSON.stringify(included) : JSON.stringify([]);
        const stringExcluded = excluded ? JSON.stringify(excluded) : JSON.stringify([]);

        // PERBAIKAN: Teruskan stringIncluded dan stringExcluded ke fungsi updatePackage di model kamu
        const updatedPkg = await Package.updatePackage(
            req.params.id, title, price, duration, image_url, description, 
            is_available, is_featured, category, itinerary, 
            stringIncluded, stringExcluded
        );

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

module.exports = { getPackages, addPackage, updatePackage, deletePackage };