// controllers/destinationController.js
const Destination = require('../models/destinationModel');

const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.getAllDestinations();
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSingleDestination = async (req, res) => {
    try {
        const destination = await Destination.getDestinationById(req.params.id);
        if (!destination) return res.status(404).json({ message: "Destination not found" });
        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDestinations, getSingleDestination };