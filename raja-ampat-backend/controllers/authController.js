const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// Kunci rahasia untuk Token (Nantinya lebih aman ditaruh di file .env)
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_ampatheia_super_aman_123';

const authController = {
  // --- FUNGSI DAFTAR (REGISTER) ---
  register: async (req, res) => {
    try {
      const { name, email, password, phone, role } = req.body;

      // 1. Validasi: Pastikan semua kolom wajib diisi
      if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: "Semua kolom wajib diisi!" });
      }

      // 2. Cek apakah email sudah pernah didaftarkan
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email sudah terdaftar! Silakan langsung masuk/login." });
      }

      // 3. Acak (Hash) kata sandi demi keamanan
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Simpan data pengunjung ke database (Default role diset 'user' jika kosong)
      const newUser = await UserModel.createUser(
        name, 
        email, 
        hashedPassword, 
        phone, 
        role || 'user'
      );
      
      res.status(201).json({ 
        message: "Registrasi berhasil!", 
        user: newUser 
      });
    } catch (error) {
      console.error("Error pada Register:", error);
      res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
  },

  // --- FUNGSI MASUK (LOGIN) ---
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Validasi: Pastikan email dan password diisi
      if (!email || !password) {
        return res.status(400).json({ message: "Email dan kata sandi wajib diisi!" });
      }

      // 2. Cari pengguna di database berdasarkan email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        // Pesan error disamakan agar hacker tidak bisa menebak email mana yang sudah terdaftar
        return res.status(401).json({ message: "Email atau kata sandi salah." });
      }

      // 3. Cocokkan kata sandi yang diketik dengan yang ada di database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Email atau kata sandi salah." });
      }

      // 4. Buatkan Tiket Masuk (Token JWT)
      const token = jwt.sign(
        { id: user.id, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' } // Token akan hangus otomatis dalam 1 hari
      );

      // 5. Buang data password sebelum dikirim ke frontend React agar aman
      const userData = { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        role: user.role 
      };

      res.status(200).json({ 
        message: "Login berhasil!", 
        token: token, 
        user: userData 
      });
    } catch (error) {
      console.error("Error pada Login:", error);
      res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
  }
};

module.exports = authController;