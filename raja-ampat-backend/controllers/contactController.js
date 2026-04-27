const ContactModel = require('../models/contactModel'); // Import file Model

// 1. TAMPILKAN SEMUA PESAN (GET)
const getInboxMessages = async (req, res) => {
  try {
    const messages = await ContactModel.getAll();
    res.json(messages);
  } catch (err) {
    console.error("Error GET Inbox:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 2. HAPUS PESAN (DELETE)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactModel.delete(id);
    res.json({ message: "Pesan berhasil dihapus!" });
  } catch (err) {
    console.error("Error DELETE Inbox:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. TAMBAH PESAN (POST)
const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await ContactModel.create(name, email, message);
    res.json(newMessage);
  } catch (err) {
    console.error("Error POST Inbox:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { 
  getInboxMessages, 
  deleteMessage, 
  sendMessage 
};