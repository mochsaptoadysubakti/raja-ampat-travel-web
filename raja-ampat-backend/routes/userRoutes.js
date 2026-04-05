const express = require('express');
const router = express.Router();

// Import deleteUser
const { getUsers, registerUser, loginUser, deleteUser } = require('../controllers/userController');

router.get('/', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Tambahkan rute DELETE yang menerima parameter /:id
router.delete('/:id', deleteUser);

module.exports = router;