const Itinerary = require('../models/itineraryModel');

const getPackageItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.getItineraryByPackage(req.params.packageId);
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getPackageItinerary };