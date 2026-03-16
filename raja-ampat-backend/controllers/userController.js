const User = require('../models/userModel');

const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const newUser = await User.createUser(name, email, password, phone);
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getUsers, registerUser };