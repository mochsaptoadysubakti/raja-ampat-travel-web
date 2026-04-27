const Itinerary = require('../models/itineraryModel');

// 1. GET by Package ID
const getPackageItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.getItineraryByPackage(req.params.packageId);
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. GET All
const getAllItinerary = async (req, res) => {
    try {
        const itineraries = await Itinerary.getAllItineraries(); 
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. POST (Add New)
const addItinerary = async (req, res) => {
    try {
        const { package_id, day_number, destination_id, activity } = req.body;

        // Validasi input
        if (!package_id || !day_number || !activity) {
            return res.status(400).json({ error: "package_id, day_number, dan activity wajib diisi!" });
        }

        const newItinerary = await Itinerary.addItinerary(package_id, day_number, destination_id, activity);
        
        res.status(201).json({
            message: "Itinerary berhasil ditambahkan!",
            data: newItinerary
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. DELETE
const deleteItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await Itinerary.deleteItinerary(id);

        if (!deletedData) {
            return res.status(404).json({ error: "Data itinerary tidak ditemukan!" });
        }

        res.status(200).json({
            message: "Itinerary berhasil dihapus!",
            data: deletedData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    getPackageItinerary, 
    getAllItinerary,
    addItinerary,
    deleteItinerary
};