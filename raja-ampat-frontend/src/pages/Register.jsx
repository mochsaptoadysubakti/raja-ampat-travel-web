import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  // State digabung agar lebih rapi
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // --- STATE BARU UNTUK ANIMASI SUKSES ---
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  // --- STATE BARU UNTUK VISIBILITAS KATA SANDI ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Handle submit form ke Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validasi 1: Cek kecocokan password
    if (formData.password !== formData.confirmPassword) {
      return setErrorMessage('Kata sandi dan Konfirmasi kata sandi tidak cocok!');
    }

    // Validasi 2: Cek persetujuan syarat & ketentuan
    if (!formData.agreeToTerms) {
      return setErrorMessage('Anda harus menyetujui Syarat Layanan dan Kebijakan Privasi.');
    }

    setIsLoading(true);

    try {
      // Tembak data ke API Register yang sudah kita buat di backend
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      // Munculkan Animasi Sukses (Ganti Alert)
      setShowSuccessAnim(true);

      // Tunggu 2.5 detik agar pengunjung bisa melihat animasinya, lalu pindah ke Login
      setTimeout(() => {
        setShowSuccessAnim(false);
        navigate('/login');
      }, 2500);

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Terjadi kesalahan saat mendaftar. Coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* INJEKSI CSS UNTUK FULL SPLIT-SCREEN LAYOUT TANPA HEADER & ANIMASI POPUP */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
          h1, h2, h3, .brand-text { font-family: 'Poppins', sans-serif; }

          /* Layout Layar Terbelah (Split Screen) - Full Height */
          .split-layout {
            display: flex;
            width: 100vw;
            min-height: 100vh;
          }

          /* Panel Kiri (Gambar Full Width & Height) */
          .image-panel {
            width: 50%;
            position: relative;
          }
          .image-panel img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          /* Panel Kanan (Form Wrapper) */
          .form-panel-wrapper {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #FAFAFA;
            padding: 40px;
          }

          /* Area Form Sesungguhnya */
          .form-panel {
            width: 100%;
            max-width: 500px;
            animation: fadeIn 0.6s ease forwards;
          }

          @keyframes fadeIn { 
            0% { opacity: 0; transform: translateY(15px); } 
            100% { opacity: 1; transform: translateY(0); } 
          }

          /* Styling Input & Button */
          .form-control-custom { 
            background-color: #F3F4F6; 
            border: 1px solid transparent; 
            padding: 12px 16px; 
            border-radius: 10px; 
            transition: all 0.3s ease; 
            font-size: 0.95rem; 
            width: 100%;
          }
          .form-control-custom:focus { 
            background-color: #fff; 
            border-color: #FFB76C; 
            box-shadow: 0 0 0 4px rgba(255, 183, 108, 0.15); 
            outline: none; 
          }

          /* Input Wrapper untuk Ikon Mata */
          .password-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
          }
          .password-toggle-btn {
            position: absolute;
            right: 15px;
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s ease;
          }
          .password-toggle-btn:hover {
            color: #111;
          }
          .password-input-wrapper input {
            padding-right: 40px; /* Ruang untuk ikon mata */
          }

          .btn-modern { 
            background-color: #FFB76C; 
            color: #111; 
            font-weight: 600; 
            padding: 14px; 
            border-radius: 10px; 
            border: none; 
            transition: all 0.3s ease; 
            font-size: 1rem;
          }
          .btn-modern:hover:not(:disabled) { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 15px rgba(255, 183, 108, 0.3); 
          }
          .btn-modern:disabled { 
            background-color: #ccc; 
            cursor: not-allowed; 
          }

          /* --- CSS UNTUK POPUP MODAL ANIMASI SUKSES --- */
          .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px);
            z-index: 1050; display: flex; justify-content: center; align-items: center;
            padding: 20px; opacity: 0; animation: fadeInModal 0.3s forwards;
          }
          .modal-content-small {
            background-color: #fff; border-radius: 20px; max-width: 400px; width: 100%;
            padding: 40px 20px; text-align: center; transform: scale(0.9);
            animation: scaleUpModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
          }
          @keyframes fadeInModal { to { opacity: 1; } }
          @keyframes scaleUpModal { to { transform: scale(1); } }
          
          /* Icon Centang Sukses */
          .success-icon {
            width: 70px; height: 70px; background-color: #E8F5E9; color: #4CAF50;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            margin: 0 auto 20px auto;
          }

          /* Responsive untuk layar HP / Tablet */
          @media (max-width: 991px) {
            .split-layout { flex-direction: column; }
            .image-panel { width: 100%; height: 35vh; }
            .form-panel-wrapper { width: 100%; min-height: 65vh; padding: 40px 20px; }
          }
        `}
      </style>

      {/* --- POPUP (MODAL) ANIMASI SUKSES REGISTER --- */}
      {showSuccessAnim && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content-small">
            <div className="success-icon">
              <svg width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg>
            </div>
            <h3 className="fw-bold text-dark mb-2">Pendaftaran Berhasil!</h3>
            <p className="text-secondary small mb-0">Tunggu sebentar, mengarahkan Anda ke halaman masuk...</p>
          </div>
        </div>
      )}

      {/* AREA LAYAR TERBELAH (SPLIT SCREEN) */}
      <div className="split-layout">
        
        {/* PANEL KIRI: GAMBAR FULL */}
        <div className="image-panel">
          <img 
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0a9cd51c-199f-4340-8567-32af323669bd" 
            alt="Raja Ampat Scenery" 
          />
        </div>

        {/* PANEL KANAN: AREA FORM */}
        <div className="form-panel-wrapper">
          <div className="form-panel">
            
            <div className="mb-4">
              <h2 className="fw-bold text-dark mb-1 fs-1">Buat Akun</h2>
              <p className="text-secondary small">Daftar untuk memesan liburan impian Anda.</p>
            </div>

            {errorMessage && (
              <div className="alert alert-danger py-2 small border-0 rounded-3" role="alert">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Nama Lengkap */}
                <div className="col-12">
                  <label className="form-label text-dark fw-medium small mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-control form-control-custom" 
                    placeholder="Nama Anda" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>

                {/* Alamat Email */}
                <div className="col-12">
                  <label className="form-label text-dark fw-medium small mb-1">Alamat Email</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control form-control-custom" 
                    placeholder="anda@domain.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>

                {/* Nomor Telepon */}
                <div className="col-12">
                  <label className="form-label text-dark fw-medium small mb-1">Nomor Telepon</label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="form-control form-control-custom" 
                    placeholder="+62 812 3456 7890" 
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                  />
                </div>

                {/* Kata Sandi dengan Icon Mata */}
                <div className="col-md-6">
                  <label className="form-label text-dark fw-medium small mb-1">Kata Sandi</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      className="form-control form-control-custom" 
                      placeholder="********" 
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        // Icon Eye-Slash (Sembunyikan)
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
                          <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                        </svg>
                      ) : (
                        // Icon Eye (Lihat)
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Konfirmasi Kata Sandi dengan Icon Mata */}
                <div className="col-md-6">
                  <label className="form-label text-dark fw-medium small mb-1">Konfirmasi Kata Sandi</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword"
                      className="form-control form-control-custom" 
                      placeholder="********" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required 
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        // Icon Eye-Slash
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/>
                          <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>
                        </svg>
                      ) : (
                        // Icon Eye
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Syarat & Ketentuan */}
                <div className="col-12 mt-3">
                  <div className="form-check d-flex align-items-center gap-2">
                    <input 
                      className="form-check-input mt-0" 
                      type="checkbox" 
                      name="agreeToTerms"
                      id="termsCheckbox" 
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                    <label className="form-check-label small text-secondary" htmlFor="termsCheckbox" style={{ cursor: 'pointer', marginTop: '2px' }}>
                      Saya setuju dengan Syarat Layanan dan Kebijakan Privasi
                    </label>
                  </div>
                </div>

                {/* Tombol Submit */}
                <div className="col-12 mt-4">
                  <button type="submit" className="btn btn-modern w-100" disabled={isLoading}>
                    {isLoading ? 'Memproses...' : 'Buat Akun'}
                  </button>
                </div>
              </div>
            </form>

            {/* Tautan Login */}
            <div className="text-center mt-4">
              <p className="text-secondary small mb-0">
                Sudah punya akun? <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#FFB76C' }}>Masuk di sini</Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;