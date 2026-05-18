const express = require('express');
const router = express.Router();

// Import controller yang sudah kita buat sebelumnya
const authController = require('../controllers/authController');

// --- PINTU GERBANG AUTENTIKASI ---

// Rute untuk Mendaftar (Register)
// React akan "menembak" ke: POST http://localhost:5000/api/auth/register
router.post('/register', authController.register);

// Rute untuk Masuk (Login)
// React akan "menembak" ke: POST http://localhost:5000/api/auth/login
router.post('/login', authController.login);

module.exports = router;