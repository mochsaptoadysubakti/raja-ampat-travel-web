const express = require('express');
const router = express.Router();

// Import semua fungsi dari controller termasuk updateUser
const { 
    getUsers, 
    registerUser, 
    loginUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController');

// [READ] Mendapatkan semua daftar user
router.get('/', getUsers);

// [CREATE] Registrasi atau tambah user baru
router.post('/register', registerUser);

// [AUTH] Login user
router.post('/login', loginUser);

// [UPDATE] Memperbarui data user berdasarkan ID
// Ini yang akan dipanggil saat kamu klik "Simpan Perubahan" di dashboard
router.put('/:id', updateUser);

// [DELETE] Menghapus user berdasarkan ID
router.delete('/:id', deleteUser);

module.exports = router;