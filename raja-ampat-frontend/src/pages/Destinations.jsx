import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebook, FaGlobe } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Destinations = () => {
  const navigate = useNavigate();

  // --- STATE DATA ---
  const [allDestinations, setAllDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState(null); 

  // --- STATE USER & UI ---
  const [user, setUser] = useState(null);
  const [showLogoutAnim, setShowLogoutAnim] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mengambil data dari API & Cek Sesi
  useEffect(() => {
    window.scrollTo(0, 0);
    // Cek User
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch Destinasi
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/destinations`); 
        const dataArray = response.data?.data || response.data || [];
        if (Array.isArray(dataArray)) {
          setAllDestinations(dataArray);
          setFilteredDestinations(dataArray);
        }
      } catch (error) {
        console.error("Gagal memuat data Destinasi:", error.message);
      }
    };

    fetchDestinations();
  }, []);

  // --- LOGIKA PENCARIAN (HANYA BERDASARKAN NAMA TEMPAT) ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDestinations(allDestinations);
    } else {
      const query = searchQuery.toLowerCase();
      // Filter hanya mencocokkan dest.name
      const filtered = allDestinations.filter(dest => 
        dest.name && dest.name.toLowerCase().includes(query)
      );
      setFilteredDestinations(filtered);
    }
  }, [searchQuery, allDestinations]);

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

  // Fungsi potong teks agar rapi di card
  const truncateText = (text, maxLength) => {
    if (!text) return "Jelajahi keindahan alam yang memukau di destinasi eksotis Raja Ampat ini.";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Tentukan destinasi utama (Featured) - Ambil item pertama dari data asli
  const featuredDest = allDestinations.length > 0 ? allDestinations[0] : null;
  
  // Sisanya untuk Grid (Berdasarkan filter pencarian)
  const gridDestinations = filteredDestinations.length > 1 && !searchQuery 
    ? filteredDestinations.slice(1) 
    : filteredDestinations; 

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', overflowX: 'hidden', paddingTop: '70px' }}>
      
      {/* --- INJEKSI CSS --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');

          body, p, a, span, input { font-family: 'Inter', sans-serif; }
          h1, h2, h3, h4, h5, .brand-text { font-family: 'Poppins', sans-serif; }

          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .anim-fade-up { animation: fadeInUp 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          
          .nav-link-custom { transition: color 0.3s ease; color: #555; }
          .nav-link-custom:hover { color: #000 !important; }

          /* HERO SECTION DESTINASI (TIDAK ADA OVERLAP NEGATIF) */
          .dest-hero {
            background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9d90b560-2bff-4520-aa51-132810017c74');
            background-size: cover;
            background-position: center;
            padding: 140px 0 100px 0; 
            text-align: center;
            color: white;
            border-radius: 0 0 40px 40px;
            margin-bottom: 40px; /* Jarak lega ke konten bawah */
          }
          .dest-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px; text-transform: uppercase; }
          .dest-hero p { font-size: 1.2rem; max-width: 600px; margin: 0 auto; opacity: 0.9; line-height: 1.6; }

          /* FEATURED DESTINATION CARD */
          .featured-card { background: #fff; border-radius: 24px; overflow: hidden; position: relative; min-height: 400px; display: flex; align-items: flex-end; box-shadow: 0 15px 35px rgba(0,0,0,0.10); margin-bottom: 30px; cursor: pointer; transition: transform 0.3s; }
          .featured-card:hover { transform: translateY(-5px); }
          .featured-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; transition: transform 0.7s; }
          .featured-card:hover .featured-img { transform: scale(1.05); }
          .featured-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%); z-index: 2; }
          .featured-content { position: relative; z-index: 3; padding: 40px; color: white; width: 100%; max-width: 800px; }

          /* SEARCH BAR */
          .search-container { background: #fff; border-radius: 50px; padding: 8px 15px 8px 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); display: flex; align-items: center; max-width: 700px; margin: 0 auto 50px auto; border: 1px solid #eee; }
          .search-input { border: none; outline: none; width: 100%; font-size: 1rem; color: #333; background: transparent; }
          .search-btn { background: #111; color: #fff; border: none; border-radius: 40px; padding: 12px 30px; font-weight: 600; transition: all 0.3s; }
          .search-btn:hover { background: #FFB76C; color: #111; }
          
          /* GRID DESTINATION CARD */
          .dest-card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.04); transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; cursor: pointer; border: 1px solid #f5f5f5;}
          .dest-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: #FFB76C; }
          .dest-img-wrap { position: relative; height: 240px; width: 100%; overflow: hidden; }
          .dest-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
          .dest-card:hover .dest-img { transform: scale(1.08); }
          
          .dest-badge { position: absolute; top: 15px; left: 15px; background: rgba(255,183,108,0.9); padding: 6px 15px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; color: #111; z-index: 2; text-transform: uppercase; letter-spacing: 1px;}
          .dest-content { padding: 25px; flex: 1; display: flex; flex-direction: column; }
          .dest-title { font-size: 1.3rem; font-weight: 700; color: #111; margin-bottom: 12px; line-height: 1.4; text-transform: capitalize; }
          .dest-desc { color: #64748B; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px; }
          .dest-readmore { display: flex; align-items: center; gap: 10px; font-weight: 700; color: #111; margin-top: auto; font-size: 0.9rem; transition: color 0.3s;}
          .dest-card:hover .dest-readmore { color: #FFB76C; }
          .readmore-icon { transition: transform 0.3s; }
          .dest-card:hover .readmore-icon { transform: translateX(5px); }

          /* MODAL */
          .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); z-index: 1050; display: flex; justify-content: center; align-items: center; padding: 20px; opacity: 0; animation: fadeInModal 0.3s forwards; }
          .modal-content-custom { background-color: #fff; border-radius: 24px; max-width: 700px; width: 100%; overflow: hidden; position: relative; transform: scale(0.9); animation: scaleUpModal 0.3s forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
          .modal-content-small { background-color: #fff; border-radius: 20px; max-width: 400px; width: 100%; padding: 40px 20px; text-align: center; transform: scale(0.9); animation: scaleUpModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
          .modal-img-detail { width: 100%; height: 350px; object-fit: cover; }
          @keyframes fadeInModal { to { opacity: 1; } }
          @keyframes scaleUpModal { to { transform: scale(1); } }
          
          .spinner-custom { width: 50px; height: 50px; border: 4px solid rgba(255, 183, 108, 0.3); border-top-color: #FFB76C; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto; }
          @keyframes spin { 100% { transform: rotate(360deg); } }

          /* MOBILE RESPONSIVE */
          @media (max-width: 991px) {
            .dest-hero h1 { font-size: 2.5rem; }
            .search-container { flex-direction: column; border-radius: 20px; padding: 15px; }
            .search-input { margin-bottom: 10px; padding: 5px; text-align: center; }
            .search-btn { width: 100%; }
            .featured-content { padding: 25px; }
          }

          /*--footer--*/
          .social-link {
            transition: all 0.3s ease;
            color: #111 !important; /* ✅ DIPERBAIKI: Memaksa warna jadi hitam pekat */
          }
          .social-link:hover {
            transform: translateX(5px);
            color: #ffffff !important;
          }
          .social-icon {
            font-size: 28px;
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

      {/* --- MODAL DETAIL DESTINASI --- */}
      {selectedDest && (
        <div className="modal-overlay" onClick={() => setSelectedDest(null)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedDest(null)}
              className="btn btn-light position-absolute rounded-circle shadow-sm"
              style={{ top: '15px', right: '15px', width: '40px', height: '40px', zIndex: 10, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#333' }}
            >
              ✕
            </button>
            <img 
              src={selectedDest.image_url || selectedDest.image || selectedDest.foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7454272c-e62f-44c0-b6b3-bf8bdcfa8120"} 
              className="modal-img-detail" 
              alt={selectedDest.name} 
            />
            <div className="p-4 p-md-5">
              <span className="badge mb-3 px-3 py-2 rounded-pill" style={{ backgroundColor: '#FFF5EC', color: '#FFB76C', fontWeight: 700 }}>
                DESTINASI EKSOTIS
              </span>
              <h2 className="fw-bold text-dark mb-3" style={{ textTransform: 'capitalize', letterSpacing: '-1px' }}>
                {selectedDest.name}
              </h2>
              <p className="text-secondary fs-6" style={{ lineHeight: '1.8' }}>
                {selectedDest.description || "Jelajahi keindahan alam yang memukau dan pengalaman tak terlupakan di destinasi ini. Tempat yang sempurna untuk melepas penat dan menikmati pesona alam eksotis Raja Ampat yang tiada duanya."}
              </p>
              <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <span className="text-muted small"><i className="bi bi-geo-alt-fill me-1"></i> Raja Ampat, Papua Barat Daya</span>
                <Link to="/tour-packages" className="btn px-4 py-2 fw-semibold rounded-pill" style={{ backgroundColor: '#111', color: '#fff' }}>
                  Lihat Paket Wisata
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- NAVBAR MODERN --- */}
      <nav className="navbar py-2 fixed-top" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 999 }}>
        <div className="container-fluid px-4 px-lg-5 d-flex align-items-center">
          <Link className="navbar-brand fw-bold fs-3" style={{ color: '#111', letterSpacing: '-0.5px' }} to="/">
            Ampatheia<span style={{ color: '#FFB76C' }}>.</span>
          </Link>
          <button className="d-lg-none ms-auto" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#111' }}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
          <div className={`align-items-center gap-4 ms-lg-auto d-lg-flex ${isMobileMenuOpen ? 'd-flex flex-column position-absolute top-100 w-100 bg-white p-4 shadow' : 'd-none'}`}>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/">Beranda</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/tour-packages">Paket Wisata</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom fw-bold text-dark" to="/destinasi">Destinasi</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/Blog">Blog</Link>
            
            {user ? (
              <Link to="/profile" className="d-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border text-decoration-none" style={{ transition: 'all 0.3s' }}>
                <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Halo, <span style={{color: '#FFB76C'}}>{user.name.split(' ')[0]}</span></span>
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=FFB76C&color=000&bold=true`} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
              </Link>
            ) : (
              <>
                <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/login">Masuk</Link>
                <Link className="text-white text-decoration-none fs-6 fw-medium rounded-pill px-4 py-2" style={{ backgroundColor: '#111', transition: 'all 0.3s' }} to="/register">Daftar</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="container-fluid px-0 anim-fade-up">
        <div className="dest-hero">
          <h1>Destinasi Populer</h1>
          <p>Get inspired by travel stories, tips, and guides from the beautiful islands of Raja Ampat.</p>
        </div>
      </div>

      {/* --- BUNGKUSAN KONTEN UTAMA --- */}
      <div className="container pb-5 mb-5" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* --- FEATURED DESTINATION (KARTU BESAR DI ATAS) --- */}
        {/* Tampil hanya jika tidak sedang mencari (searchQuery kosong) */}
        {featuredDest && !searchQuery && (
          <div className="featured-card anim-fade-up" style={{ animationDelay: '0.1s' }} onClick={() => setSelectedDest(featuredDest)}>
            <img 
              src={featuredDest.image_url || featuredDest.image || featuredDest.foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7454272c-e62f-44c0-b6b3-bf8bdcfa8120"} 
              alt={featuredDest.name} 
              className="featured-img" 
            />
            <div className="featured-overlay"></div>
            <div className="featured-content">
              <span className="badge mb-3 px-3 py-2 rounded-pill" style={{ backgroundColor: '#FFB76C', color: '#111', fontWeight: 700, letterSpacing: '1px' }}>
                SOROTAN UTAMA
              </span>
              <h1 className="fw-bold mb-3 display-5" style={{ textTransform: 'capitalize' }}>{featuredDest.name}</h1>
              <p className="fs-5 mb-4 opacity-75">{truncateText(featuredDest.description, 150)}</p>
              <div className="d-flex align-items-center gap-2 text-white fw-bold" style={{ fontSize: '1.1rem' }}>
                Jelajahi Sekarang 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* --- SEARCH BAR DI BAWAH SOROTAN UTAMA --- */}
        <div className="search-container anim-fade-up" style={{ animationDelay: '0.2s' }}>
          <i className="bi bi-search text-muted ms-2 me-3 fs-5"></i>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Cari nama destinasi atau tempat wisata..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn d-none d-md-block">Cari</button>
        </div>

        {/* --- GRID DESTINASI --- */}
        <div className="row g-4 mt-2">
          {gridDestinations.length > 0 ? gridDestinations.map((dest, index) => (
            <div className="col-lg-4 col-md-6 anim-fade-up" key={dest.id || index} style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}>
              <div className="dest-card" onClick={() => setSelectedDest(dest)}>
                
                <div className="dest-img-wrap">
                  <span className="dest-badge">Destinasi Alam</span>
                  <img 
                    src={dest.image_url || dest.image || dest.foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ba9615c7-85a2-470e-b578-6229f7cfca1f"} 
                    alt={dest.name} 
                    className="dest-img"
                  />
                </div>
                
                <div className="dest-content">
                  <div className="d-flex align-items-center gap-2 mb-3 text-muted small fw-medium">
                    <img src={`https://ui-avatars.com/api/?name=Tim+Ampatheia&background=F3F4F6&color=666`} className="rounded-circle" style={{width:'24px', height:'24px'}} alt="Author"/>
                    <span>Tim Ampatheia</span>
                    <span>•</span>
                    <span>Terbaru</span>
                  </div>
                  
                  <h3 className="dest-title">{dest.name}</h3>
                  <p className="dest-desc">{truncateText(dest.description, 100)}</p>
                  
                  <div className="dest-readmore mt-3">
                    Read more 
                    <svg className="readmore-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          )) : (
            <div className="col-12 text-center py-5">
              <div className="mb-3" style={{ fontSize: '3rem', opacity: '0.3' }}>🔍</div>
              <h4 className="text-secondary fw-semibold mb-2">Destinasi tidak ditemukan</h4>
              <p className="text-muted">Coba cari dengan nama tempat yang lain.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- FOOTER KONSISTEN --- */}
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
                      to="/blog"
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
                    className="social-link text-dark text-decoration-none d-flex align-items-center gap-2" /* ✅ DITAMBAHKAN class text-dark */
                  >
                    <FaInstagram size={22} />
                    <span>ampatheia.id</span>
                  </a>

                  <a
                    href="https://facebook.com/ampatheia.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link text-dark text-decoration-none d-flex align-items-center gap-2" /* ✅ DITAMBAHKAN class text-dark */
                  >
                    <FaFacebook size={22} />
                    <span>ampatheia.id</span>
                  </a>

                  <a
                    href="https://ampatheia.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link text-dark text-decoration-none d-flex align-items-center gap-2" /* ✅ DITAMBAHKAN class text-dark */
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

export default Destinations;