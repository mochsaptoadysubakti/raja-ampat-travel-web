import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebook, FaGlobe } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaRegClock } from "react-icons/fa";

const TourPackages = () => {
  const navigate = useNavigate();

  // --- STATE DATA ---
  const [allPackages, setAllPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  
  // --- STATE FILTER ---
  const [priceRange, setPriceRange] = useState(75000000); // Default max 75 Juta
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // --- STATE USER, ANIMASI LOGOUT & PROFIL ---
  const [user, setUser] = useState(null);
  const [showLogoutAnim, setShowLogoutAnim] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State untuk Popup Profil

  // Mengambil data dari API & Cek Sesi
  useEffect(() => {
    // Cek User
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch Paket Wisata
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tour_packages`); 
        const dataArray = response.data.data || response.data || [];
        if (Array.isArray(dataArray)) {
          setAllPackages(dataArray);
          setFilteredPackages(dataArray);
        }
      } catch (error) {
        console.error("Gagal memuat data Paket Wisata:", error.message);
      }
    };

    fetchPackages();
  }, []);

  // --- LOGIKA FILTER ---
  useEffect(() => {
    let result = allPackages;

    // Filter Harga
    result = result.filter(pkg => Number(pkg.price || 0) <= priceRange);

    // Filter Durasi
    if (selectedDuration) {
      result = result.filter(pkg => pkg.duration && pkg.duration.includes(selectedDuration));
    }

    // Filter Kategori
    if (selectedCategory) {
      result = result.filter(pkg => 
        (pkg.category && pkg.category.toLowerCase() === selectedCategory.toLowerCase()) ||
        (pkg.title && pkg.title.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }

    setFilteredPackages(result);
  }, [priceRange, selectedDuration, selectedCategory, allPackages]);

  // Fungsi Reset Filter
  const handleResetFilter = () => {
    setPriceRange(75000000);
    setSelectedDuration("");
    setSelectedCategory("");
  };

  // --- FUNGSI LOGOUT ---
  const handleLogout = () => {
    setShowLogoutAnim(true);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    setTimeout(() => {
      setShowLogoutAnim(false);
      navigate('/login');
    }, 2000); 
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', overflowX: 'hidden', paddingTop: '70px' }}>
      
      {/* --- INJEKSI CSS --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700;800&display=swap');

          body, p, a, span, input, select { font-family: 'Inter', sans-serif; }
          h1, h2, h3, h4, h5, .brand-text { font-family: 'Poppins', sans-serif; }

          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          
          .anim-fade-up { animation: fadeInUp 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          
          .nav-link-custom { transition: color 0.3s ease; color: #555; }
          .nav-link-custom:hover { color: #000 !important; }

          .btn-modern { transition: all 0.3s ease; font-weight: 600;}
          .btn-modern:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1); }

          /* HERO SECTION PAKET WISATA */
          .packages-hero {
            background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4edd24f0-cd5b-4271-a94e-add9f4430f2a');
            background-size: cover;
            background-position: center;
            padding: 100px 0;
            text-align: center;
            color: white;
            border-radius: 0 0 40px 40px;
            margin-bottom: 40px;
          }
          
          .packages-hero h1 { font-size: 3rem; font-weight: 700; margin-bottom: 15px; letter-spacing: -1px; }
          .packages-hero p { font-size: 1.1rem; max-width: 600px; margin: 0 auto; opacity: 0.9; line-height: 1.6; }

          /* FILTER SIDEBAR */
          .filter-sidebar {
            background-color: #fff;
            border-radius: 20px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.04);
            position: sticky;
            top: 90px;
          }
          .filter-title { font-size: 1.2rem; font-weight: 700; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; margin-bottom: 20px; }
          .filter-label { font-weight: 600; font-size: 0.9rem; color: #333; margin-bottom: 10px; display: block; }
          
          .form-range-custom { width: 100%; accent-color: #FFB76C; }
          .filter-select { background-color: #F3F4F6; border: none; border-radius: 10px; padding: 10px 15px; width: 100%; font-size: 0.95rem; margin-bottom: 25px; outline: none; transition: all 0.3s ease; }
          .filter-select:focus { box-shadow: 0 0 0 3px rgba(255, 183, 108, 0.2); }

          /* CARD PAKET WISATA */
          .pkg-card {
            background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.03); transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column;
          }
          .pkg-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
          .pkg-img-wrap { position: relative; height: 220px; width: 100%; overflow: hidden; }
          .pkg-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
          .pkg-card:hover .pkg-img { transform: scale(1.05); }
          .pkg-badge { position: absolute; top: 15px; left: 15px; background: #FFB76C; backdrop-filter: blur(5px); padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; color: #111; z-index: 2; }
          .pkg-content { padding: 20px; flex: 1; display: flex; flex-direction: column; }
          .pkg-title { font-size: 1.2rem; font-weight: 700; color: #111; margin-bottom: 10px; line-height: 1.4; }
          .pkg-meta { display: flex; align-items: center; gap: 15px; font-size: 0.85rem; color: #666; margin-bottom: 20px; font-weight: 500;}
          .pkg-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 15px; border-top: 1px dashed #eee; }
          .pkg-price { font-size: 1.1rem; font-weight: 700; color: #111; }

          /* MODAL (HANYA UNTUK LOGOUT) */
          .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); z-index: 1050; display: flex; justify-content: center; align-items: center; padding: 20px; opacity: 0; animation: fadeInModal 0.3s forwards; }
          .modal-content-small { background-color: #fff; border-radius: 20px; max-width: 400px; width: 100%; padding: 40px 20px; text-align: center; transform: scale(0.9); animation: scaleUpModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
          @keyframes fadeInModal { to { opacity: 1; } }
          @keyframes scaleUpModal { to { transform: scale(1); } }
          .spinner-custom { width: 50px; height: 50px; border: 4px solid rgba(255, 183, 108, 0.3); border-top-color: #FFB76C; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto; }
          @keyframes spin { 100% { transform: rotate(360deg); } }

          /* --- CSS UNTUK POPUP PROFIL (DROPDOWN) --- */
          .profile-dropdown-container { position: relative; }
          .profile-popup {
            position: absolute;
            top: 130%;
            right: 0;
            width: 280px;
            background-color: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.12);
            padding: 24px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 1050;
            border: 1px solid rgba(0,0,0,0.05);
          }
          .profile-popup.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
          .profile-popup::before {
            content: '';
            position: absolute;
            top: -6px;
            right: 20px;
            width: 14px;
            height: 14px;
            background-color: #fff;
            transform: rotate(45deg);
            border-left: 1px solid rgba(0,0,0,0.05);
            border-top: 1px solid rgba(0,0,0,0.05);
          }
          .profile-popup-avatar { width: 64px; height: 64px; border-radius: 50%; border: 3px solid #FFB76C; padding: 2px; }

          /*--footer--*/
          .social-link {
            transition: all 0.3s ease;
            color: #000;
          }
          .social-link:hover {
            transform: translateX(5px);
            color: #ffffff !important;
          }
          .social-icon {
            font-size: 28px;
          }

          /* MOBILE RESPONSIVE */
          @media (max-width: 991px) {
            .packages-hero h1 { font-size: 2.2rem; }
            .filter-sidebar { position: relative; top: 0; margin-bottom: 30px; }
            .nav-actions-mobile { display: flex !important; flex-direction: column; position: absolute; top: 70px; left: 5vw; right: 5vw; background: #fff; padding: 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); text-align: center; gap: 15px !important; z-index: 1000; }
            .profile-popup { right: 50%; transform: translateX(50%) translateY(-10px); }
            .profile-popup.open { transform: translateX(50%) translateY(0); }
            .profile-popup::before { right: 50%; transform: translateX(50%) rotate(45deg); }
          }
        `}
      </style>

      {/* --- POPUP LOGOUT --- */}
      {showLogoutAnim && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content-small">
            <div className="spinner-custom"></div>
            <h4 className="fw-bold text-dark mb-2">Sampai Jumpa!</h4>
            <p className="text-secondary small mb-0">Sedang mengeluarkan akun Anda...</p>
          </div>
        </div>
      )}

      {/* --- NAVBAR MODERN (SAMA SEPERTI HOME & ADA LINK BERANDA) --- */}
      <nav className="navbar py-2 fixed-top" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 999 }}>
        <div className="container-fluid px-4 px-lg-5 d-flex align-items-center">
          
          <Link className="navbar-brand fw-bold fs-3" style={{ color: '#111', letterSpacing: '-0.5px' }} to="/">
            Ampatheia<span style={{ color: '#FFB76C' }}>.</span>
          </Link>

          <button 
            className="d-lg-none ms-auto" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#111', cursor: 'pointer', padding: 0 }}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>

          <div className={`align-items-center gap-4 ms-lg-auto d-lg-flex ${isMobileMenuOpen ? 'nav-actions-mobile' : 'd-none'}`}>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/tour-packages" onClick={() => setIsMobileMenuOpen(false)}>Paket Wisata</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/destinasi" onClick={() => setIsMobileMenuOpen(false)}>Destinasi</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/Blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            
            {user ? (
              <Link 
                className="d-flex align-items-center gap-2 px-3 py-1 shadow-sm text-decoration-none" 
                style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '50px', transition: 'all 0.3s', zIndex: 1041 }}
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <span className="fw-bold text-dark fs-6 d-none d-md-block" style={{ fontSize: '0.9rem' }}>
                  Halo, <span style={{ color: '#FFB76C' }}>{user.name.split(' ')[0]}</span>
                </span>
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=FFB76C&color=000&bold=true`} 
                  alt="Profile" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                />
              </Link>
            ) : (
              <>
                <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/login" onClick={() => setIsMobileMenuOpen(false)}>Masuk</Link>
                <Link className="text-white text-decoration-none fs-6 fw-medium rounded-pill px-4 py-2 btn-modern" style={{ backgroundColor: '#212529' }} to="/register" onClick={() => setIsMobileMenuOpen(false)}>Daftar</Link>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* --- HERO SECTION PAKET WISATA --- */}
      <div className="container-fluid px-0 anim-fade-up">
        <div className="packages-hero">
          <h1>Mulai Petualanganmu di Raja Ampat</h1>
          <p>Temukan paket wisata pilihan dengan pengalaman seru, pemandangan menakjubkan, dan perjalanan yang berkesan.</p>
        </div>
      </div>

      {/* --- KONTEN UTAMA (FILTER & GRID) --- */}
      <div className="container pb-5 mb-5">
        <div className="row g-4">
          
          {/* KOLOM KIRI: FILTER SIDEBAR */}
          <div className="col-lg-3">
            <div className="filter-sidebar anim-fade-up">
              <h4 className="filter-title">Filter Paket</h4>
              
              {/* Filter Range Harga */}
              <div className="mb-4">
                <label className="filter-label">Rentang Harga</label>
                <input 
                  type="range" 
                  className="form-range form-range-custom" 
                  min="0" max="75000000" step="500000" 
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between small text-secondary fw-medium mt-2">
                  <span>Rp 0</span>
                  <span>Maks Rp {priceRange.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Filter Durasi */}
              <div>
                <label className="filter-label">Durasi</label>
                <select 
                  className="filter-select"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="">Semua Durasi</option>
                  <option value="3 Hari">3 Hari</option>
                  <option value="4 Hari">4 Hari</option>
                  <option value="5 Hari">5 Hari</option>
                  <option value="7 Hari">7 Hari</option>
                </select>
              </div>

              {/* Filter Kategori */}
              <div>
                <label className="filter-label">Kategori</label>
                <select 
                  className="filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  <option value="Diving">Diving</option>
                  <option value="Bulan Madu">Bulan Madu</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Healing">Healing Trip</option>
                </select>
              </div>

              {/* Tombol Reset */}
              <button onClick={handleResetFilter} className="btn btn-modern w-100 mt-2" style={{ backgroundColor: '#FFB76C', color: '#111' }}>
                Reset Filter
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: GRID PAKET */}
          <div className="col-lg-9">
            
            <div className="d-flex justify-content-between align-items-center mb-4 anim-fade-up">
              <span className="fw-semibold text-secondary">
                Menampilkan {filteredPackages.length} dari {allPackages.length} paket
              </span>
            </div>

            <div className="row g-4">
              {filteredPackages.length > 0 ? filteredPackages.map((pkg, index) => (
                <div className="col-md-6 col-lg-4 anim-fade-up" key={pkg.id || index} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="pkg-card">
                    
                    {/* Gambar & Kategori Badge */}
                    <div className="pkg-img-wrap">
                      {pkg.category && (
                        <span className="pkg-badge">
                          {pkg.category}
                        </span>
                      )}
                      <img 
                        src={pkg.image_url || pkg.image || pkg.url || pkg.foto || pkg.link_foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/633768b4-a582-4927-a908-888fffe05996"} 
                        alt={pkg.title} 
                        className="pkg-img"
                      />
                    </div>
                    
                    {/* Konten Text */}
                    <div className="pkg-content">
                      <h3 className="pkg-title">{pkg.title || "Paket Eksklusif Raja Ampat"}</h3>
                      
                      <div className="pkg-meta">
                        <span><span style={{color: '#FFB76C'}}>★</span> 5.0</span>
                        <span>•</span>
                        <span>{pkg.duration || '7 Hari/6 Malam'}</span>
                      </div>
                      
                      <div className="pkg-footer">
                        <span className="pkg-price">Rp {Number(pkg.price || 37500000).toLocaleString('id-ID')}</span>
                        
                        {/* MENGIRIM DATA PAKET KE HALAMAN DETAIL (State Passing) */}
                        <button 
                          className="btn btn-sm btn-modern px-4 rounded-8" 
                          style={{ backgroundColor: '#FFB76C', color: '#111' }}
                          onClick={() => {
                            navigate(`/detail/${pkg.id || index}`, { state: { packageData: pkg } });
                          }}
                        >
                          Lihat Detail
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center py-5">
                  <h4 className="text-secondary fw-semibold">Maaf, paket tidak ditemukan.</h4>
                  <p className="text-muted">Coba ubah kriteria filter Anda.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- FOOTER (KONSISTEN DENGAN HOME) --- */}
    <div style={{ position: 'relative', marginTop: '50px', width: '100%', overflow: 'hidden' }}>
  
        {/* SVG OMBAK (JANGAN DIUBAH) */}
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            marginBottom: '-1px'
          }}
        >
          <path
            fill="#70E6D6"
            d="M0,32L48,48C96,64,192,96,288,101.3C384,107,480,85,576,64C672,43,768,21,864,21.3C960,21,1056,43,1152,58.7C1248,75,1344,85,1392,90.7L1440,96L1440,121L0,121Z"
          ></path>
        </svg>

        {/* KONTEN FOOTER */}
        <footer className="pt-0 pb-2" style={{ backgroundColor: '#70E6D6' }}>
          <div className="container py-3">

            <div className="row g-3 text-center justify-content-center">

              {/* Kolom 1: Ampatheia */}
              <div className="col-lg-4 px-lg-3">
                <h4
                  className="fw-bold mb-2 text-dark"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Ampatheia
                </h4>

                <p
                  className="text-dark fw-medium mb-0"
                  style={{
                    lineHeight: '1.7',
                    fontSize: '0.9rem'
                  }}
                >
                  Ampatheia hadir untuk memudahkan perjalanan wisata Anda ke Raja Ampat.
                  Temukan paket wisata lengkap, itinerary terstruktur, dan pemandu lokal
                  terpercaya dalam satu platform.
                </p>
              </div>

              {/* Kolom 2: Tautan */}
              <div className="col-lg-2 px-lg-3">
                <h6
                  className="fw-bold mb-2 text-dark"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Tautan
                </h6>

                <ul
                  className="list-unstyled text-dark fw-medium mb-0"
                  style={{
                    lineHeight: '2',
                    fontSize: '0.9rem'
                  }}
                >
                  <li>
                    <Link to="/" className="text-dark text-decoration-none nav-link-custom">
                      Beranda
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/tour-packages"
                      className="text-dark text-decoration-none nav-link-custom"
                    >
                      Paket Wisata
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="#"
                      className="text-dark text-decoration-none nav-link-custom"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Kolom 3: Hubungi Kami */}
              <div className="col-lg-3 px-lg-3">
                <h6
                  className="fw-bold mb-2 text-dark"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Hubungi Kami
                </h6>

                <ul
                  className="list-unstyled text-dark fw-medium mb-0"
                  style={{
                    lineHeight: '1.8',
                    fontSize: '0.9rem'
                  }}
                >
                  <li>Email: info@ampatheia.com</li>
                  <li>Telepon: +62 812-3456-7890</li>
                  <li>Alamat: Jakarta, Indonesia</li>
                </ul>
              </div>

              {/* Kolom 4: Ikuti Kami */}
              <div className="col-lg-3 px-lg-3">
                <h6
                  className="fw-bold mb-2 text-dark"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Ikuti Kami
                </h6>

                <div
                  className="d-flex flex-column align-items-center fw-medium mt-2"
                  style={{
                    gap: '12px',
                    fontSize: '0.9rem'
                  }}
                >
                  <a
                    href="https://instagram.com/ampatheia.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link text-decoration-none d-flex align-items-center gap-2"
                  >
                    <FaInstagram size={22} />
                    <span>ampatheia.id</span>
                  </a>

                  <a
                    href="https://facebook.com/ampatheia.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link text-decoration-none d-flex align-items-center gap-2"
                  >
                    <FaFacebook size={22} />
                    <span>ampatheia.id</span>
                  </a>

                  <a
                    href="https://ampatheia.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link text-decoration-none d-flex align-items-center gap-2"
                  >
                    <FaGlobe size={22} />
                    <span>ampatheia.id</span>
                  </a>
                </div>
              </div>

            </div>

            <div className="text-center pt-2 mt-2">
              <span
                className="text-dark fw-medium"
                style={{ fontSize: '0.85rem' }}
              >
                Copyright © 2026 Ampatheia. Hak cipta dilindungi
              </span>
            </div>

          </div>
        </footer>
    </div>

    </div>
  );
};

export default TourPackages;