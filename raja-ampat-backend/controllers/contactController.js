const Contact = require('../models/contactModel');

const submitContact = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await Contact.createContact(name, email, message);
        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { submitContact };