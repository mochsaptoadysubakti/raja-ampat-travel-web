const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registerUser = async (req, res) => {
    // Menambahkan 'role' dari req.body
    const { name, email, password, phone, role } = req.body; 
    
    try {
        // 1. Hash Password (Mengacak password)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Tentukan default role jika tidak diisi
        const userRole = role || 'user';

        // 3. Simpan menggunakan password yang sudah di-hash dan tambahkan role
        // PERHATIAN: Pastikan fungsi createUser di userModel.js sudah diatur untuk menerima parameter 'role'
        const newUser = await User.createUser(name, email, hashedPassword, phone, userRole);
        
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. Cari user di database berdasarkan email
        // PERHATIAN: Pastikan kamu membuat fungsi findByEmail di dalam file userModel.js
        const user = await User.findByEmail(email);
        
        if (!user) {
            return res.status(404).json({ message: "Email tidak terdaftar!" });
        }

        // 2. Cocokkan password yang diketik dengan yang ada di database (hashed)
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Password salah!" });
        }

        // 3. Buat Token (Ini yang ditangkap oleh React di frontend)
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            'KUNCI_RAHASIA_AMPATHEIA_123', // Secret key, di project nyata ini ditaruh di file .env
            { expiresIn: '1d' } // Token berlaku 1 hari
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

const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        // PERHATIAN: Pastikan kamu membuat fungsi deleteUser di dalam file userModel.js
        const deletedUser = await User.deleteUser(id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User tidak ditemukan!" });
        }
        
        res.status(200).json({ message: "User berhasil dihapus dari database!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Jangan lupa ekspor semua fungsinya
module.exports = { getUsers, registerUser, loginUser, deleteUser };