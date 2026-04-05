const Destination = require('../models/destinationModel');

const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.getAllDestinations();
        res.status(200).json({ data: destinations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addDestination = async (req, res) => {
    const { name, description, image_url } = req.body;
    try {
        const newDest = await Destination.createDestination(name, description, image_url);
        res.status(201).json({ status: "success", data: newDest, message: "Destinasi berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDestination = async (req, res) => {
    const { name, description, image_url } = req.body;
    try {
        const updatedDest = await Destination.updateDestination(req.params.id, name, description, image_url);
        if (!updatedDest) return res.status(404).json({ message: "Destinasi tidak ditemukan" });
        res.status(200).json({ status: "success", data: updatedDest, message: "Destinasi diubah!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteDestination = async (req, res) => {
    try {
        const deletedDest = await Destination.deleteDestination(req.params.id);
        if (!deletedDest) return res.status(404).json({ message: "Destinasi tidak ditemukan" });
        res.status(200).json({ status: "success", message: "Destinasi dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDestinations, addDestination, updateDestination, deleteDestination };