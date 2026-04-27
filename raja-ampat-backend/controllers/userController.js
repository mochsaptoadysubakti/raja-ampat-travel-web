const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. TAMPILKAN SEMUA USER
const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. REGISTER / TAMBAH USER BARU (Dengan Hash Password)
const registerUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body; 
    
    try {
        // Hash Password sebelum disimpan
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role || 'user';

        const newUser = await User.createUser(name, email, hashedPassword, phone, userRole);
        
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. UPDATE USER (Fungsi Baru untuk fitur Edit di Dashboard)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    try {
        const updatedUser = await User.updateUser(id, name, email, phone, role);
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User tidak ditemukan!" });
        }

        res.status(200).json({ message: "User berhasil diperbarui!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. LOGIN USER
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: "Email tidak terdaftar!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Password salah!" });
        }

        // Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            'KUNCI_RAHASIA_AMPATHEIA_123', 
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            message: "Login berhasil", 
            token: token,
            user: { id: user.id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. DELETE USER
const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedUser = await User.deleteUser(id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User tidak ditemukan!" });
        }
        
        res.status(200).json({ message: "User berhasil dihapus dari database!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getUsers, registerUser, updateUser, loginUser, deleteUser };