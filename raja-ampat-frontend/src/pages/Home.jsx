import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// --- CUSTOM HOOK UNTUK ANIMASI ANGKA BERJALAN ---
const useCountUp = (endValue, duration = 2000, isFloat = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(endValue) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = easeProgress * end;

      setCount(isFloat ? current.toFixed(1) : Math.floor(current));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(isFloat ? end.toFixed(1) : end);
      }
    };

    window.requestAnimationFrame(step);
  }, [endValue, duration, isFloat]);

  return count;
};

const Home = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [galleries, setGalleries] = useState([]);
  
  const [reviews, setReviews] = useState([]);
  const [totalPackagesNum, setTotalPackagesNum] = useState(0);
  const [avgRatingNum, setAvgRatingNum] = useState(0);
  const [totalReviewsNum, setTotalReviewsNum] = useState(0);
  
  const displayReviews = useCountUp(totalReviewsNum, 2000);
  const displayPackages = useCountUp(totalPackagesNum, 2000);
  const displayRating = useCountUp(avgRatingNum, 2000, true); 
  const displayGuide = useCountUp(100, 2000); 
  
  const [user, setUser] = useState(null);
  const [showLogoutAnim, setShowLogoutAnim] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State dibiarkan agar tidak error

  const [typedText, setTypedText] = useState("");
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [selectedDest, setSelectedDest] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fullText = "Jelajahi \nRaja Ampat";
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(timer);
      }
    }, 120); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/destinations');
        const dataArray = response.data.data || response.data || [];
        if (Array.isArray(dataArray)) {
          setDestinations(dataArray.slice(0, 4));
        }
      } catch (error) {
        console.error("Gagal memuat data Destinasi:", error.message);
      }
    };

    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tour_packages'); 
        const dataArray = response.data.data || response.data || [];
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const featuredPackages = dataArray.filter(pkg => 
            pkg.is_featured === true || pkg.is_featured === 1 || String(pkg.is_featured) === "true" || String(pkg.is_featured) === "1"
          );
          setPackages(featuredPackages.slice(0, 3));
          setTotalPackagesNum(dataArray.length); 
        } else {
          setTotalPackagesNum(10); 
        }
      } catch (error) {
        setTotalPackagesNum(10);
      }
    };

    const fetchGalleries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/gallery'); 
        const dataArray = response.data.data || response.data || [];
        if (Array.isArray(dataArray)) {
          setGalleries(dataArray.slice(0, 12)); 
        }
      } catch (error) {
        console.error("Gagal memuat Galeri:", error.message);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews');
        const dataArray = response.data.data || response.data || [];
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          setReviews(dataArray.slice(0, 3)); 
          const sum = dataArray.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
          setAvgRatingNum(sum / dataArray.length);
          setTotalReviewsNum(dataArray.length); 
        } else {
          setAvgRatingNum(4.9);
          setTotalReviewsNum(300); 
        }
      } catch (error) {
        setAvgRatingNum(4.9);
        setTotalReviewsNum(300);
      }
    };

    fetchDestinations();
    fetchPackages();
    fetchGalleries();
    fetchReviews();
  }, []);

  const handleLogout = () => {
    setShowLogoutAnim(true);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    setTimeout(() => {
      setShowLogoutAnim(false);
      window.location.reload();
    }, 2000); 
  };

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/contacts', contactForm);
      setIsSuccess(true);
      setContactForm({ name: '', email: '', message: '' }); 
    } catch (error) {
      alert('Maaf, gagal mengirim pesan. Pastikan backend sudah menyala.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', overflowX: 'hidden', paddingTop: '70px' }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700;800&display=swap');

          body, p, a, span, input, textarea { font-family: 'Inter', sans-serif; }
          h1, h2, h3, h4, h5, .navbar-brand { font-family: 'Poppins', sans-serif; }

          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes fadeInRight { 0% { opacity: 0; transform: translateX(50px); } 100% { opacity: 1; transform: translateX(0); } }
          @keyframes fadeInLeft { 0% { opacity: 0; transform: translateX(-50px); } 100% { opacity: 1; transform: translateX(0); } }
          @keyframes popIn { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
          @keyframes blinkCursor { 50% { opacity: 0; } }

          .typing-cursor { animation: blinkCursor 0.8s step-end infinite; color: #FFB76C; }
          .anim-fade-up { animation: fadeInUp 1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          .anim-fade-right { animation: fadeInRight 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          .anim-fade-left { animation: fadeInLeft 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          .anim-pop-in { animation: popIn 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          
          .delay-1 { animation-delay: 0.3s; opacity: 0; }
          .delay-2 { animation-delay: 0.6s; opacity: 0; }

          .nav-link-custom { transition: color 0.3s ease; color: #555; }
          .nav-link-custom:hover { color: #000 !important; }

          .btn-modern { transition: all 0.3s ease; }
          .btn-modern:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important; }
          .form-control-custom:focus { box-shadow: none; border-color: #FFB76C !important; background-color: #fff !important; }

          .hero-wave-left { width: 50%; max-width: 900px; object-fit: contain; object-position: top left; z-index: 1; pointer-events: none; top: 55vh; }
          .hero-wave-right { width: 35%; max-width: 600px; object-fit: contain; object-position: top right; z-index: 1; pointer-events: none; top: 5vh; }
          .hero-content-wrapper { z-index: 10; padding-top: 10vh; padding-left: 10vw; min-height: 85vh; }
          .hero-title { font-size: 3.2rem; line-height: 1.2; letter-spacing: -1px; white-space: pre-line; text-shadow: 2px 2px 15px rgba(255,255,255,0.9); }
          .hero-desc { line-height: 1.6; max-width: 85%; text-shadow: 1px 1px 10px rgba(255,255,255,0.9); }

          .stats-number { color: #11142D; font-size: 2.4rem; font-weight: 700; margin-bottom: 2px; font-family: 'Poppins', sans-serif; letter-spacing: -1px; }
          .stats-text { color: #4A4A68; font-size: 1rem; font-weight: 500; }

          .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); z-index: 1050; display: flex; justify-content: center; align-items: center; padding: 20px; opacity: 0; animation: fadeInModal 0.3s forwards; }
          .modal-content-custom { background-color: #fff; border-radius: 20px; max-width: 600px; width: 100%; overflow: hidden; position: relative; transform: scale(0.9); animation: scaleUpModal 0.3s forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
          .modal-content-small { background-color: #fff; border-radius: 20px; max-width: 400px; width: 100%; padding: 40px 20px; text-align: center; transform: scale(0.9); animation: scaleUpModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
          .modal-img { height: 350px; object-fit: cover; }
          @keyframes fadeInModal { to { opacity: 1; } }
          @keyframes scaleUpModal { to { transform: scale(1); } }
          .spinner-custom { width: 50px; height: 50px; border: 4px solid rgba(255, 183, 108, 0.3); border-top-color: #FFB76C; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto; }
          @keyframes spin { 100% { transform: rotate(360deg); } }

          /* --- CSS UNTUK POPUP PROFIL (DROPDOWN) DIBIARKAN AGAR TIDAK MENGUBAH KODE LAIN --- */
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

          /* --- CSS KHUSUS ANIMASI GALERI --- */
          .gallery-wrap { overflow: hidden; border-radius: 10px; transition: all 0.4s ease; cursor: pointer; }
          .gallery-wrap img { transition: transform 0.5s ease; }
          .gallery-wrap:hover { transform: translateY(-8px); box-shadow: 0 15px 25px rgba(0,0,0,0.15) !important; }
          .gallery-wrap:hover img { transform: scale(1.08); }

          @media (max-width: 991px) {
            .hero-wave-left { width: 100%; opacity: 0.3; top: 30vh; }
            .hero-wave-right { display: none; }
            .hero-content-wrapper { padding-left: 5vw; padding-right: 5vw; text-align: center; min-height: 70vh; }
            .hero-title { font-size: 2.4rem; white-space: normal; }
            .hero-desc { max-width: 100%; margin-left: auto; margin-right: auto; }
            .nav-actions-mobile { display: flex !important; flex-direction: column; position: absolute; top: 70px; left: 5vw; right: 5vw; background: #fff; padding: 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); text-align: center; gap: 15px !important; z-index: 1000; }
            .stats-number { font-size: 2rem; }
            .profile-popup { right: 50%; transform: translateX(50%) translateY(-10px); }
            .profile-popup.open { transform: translateX(50%) translateY(0); }
            .profile-popup::before { right: 50%; transform: translateX(50%) rotate(45deg); }
          }
          .icon-circle { width: 70px; height: 70px; background-color: #FFB76C; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #fff; }
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

      {/* --- 1. NAVBAR MODERN (DENGAN LINK KE HALAMAN PROFIL) --- */}
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
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/tour-packages" onClick={() => setIsMobileMenuOpen(false)}>Paket Wisata</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/destinasi" onClick={() => setIsMobileMenuOpen(false)}>Destinasi</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/Blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            
            {user ? (
              // PERBAIKAN: Menghapus dropdown popup dan menjadikannya Link ke halaman /profile
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

      {/* --- 2. HERO SECTION & STATISTIK --- */}
      <div className="container-fluid px-0 position-relative" style={{ backgroundColor: '#fff', zIndex: 2, paddingBottom: '60px', overflow: 'hidden' }}>
        
        <img 
          src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e3458f00-5a71-4e2f-9d68-ef1fdc5c6df6" 
          alt="Perahu Raja Ampat" 
          className="position-absolute start-0 hero-wave-left anim-fade-right"
        />
        <img 
          src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/058720a5-0eee-4604-b3df-ea48915a2d41" 
          alt="Pantai Raja Ampat" 
          className="position-absolute end-0 hero-wave-right anim-fade-left d-none d-md-block"
        />

        <div className="container-fluid position-relative hero-content-wrapper d-flex flex-column justify-content-start">
          <div className="row w-100">
            <div className="col-lg-7">
              <div className="anim-fade-up delay-1">
                <h1 className="fw-bold text-dark mb-3 hero-title">
                  {typedText}<span className="typing-cursor">|</span>
                </h1>
                <p className="text-dark mt-3 mb-5 fs-5 hero-desc fw-semibold">
                  Rasakan keindahan habitat laut paling beragam di dunia melalui pengalaman yang tak terlupakan.
                </p>
                <div className="mb-5 pb-2">
                  <Link to="/tour-packages" className="btn btn-modern fw-semibold px-4 py-3 border-0 shadow-sm rounded-pill" style={{ backgroundColor: '#FFB76C', color: '#000', fontSize: '1.05rem' }}>
                    Lihat Paket Wisata
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container position-relative" style={{ zIndex: 10, marginTop: '300px' }}>
          <div className="row text-center g-4 justify-content-center">
            <div className="col-6 col-md-3 anim-fade-up delay-1">
              <h2 className="stats-number">{displayReviews}+</h2>
              <p className="stats-text">Wisatawan Puas</p>
            </div>
            <div className="col-6 col-md-3 anim-fade-up delay-2">
              <h2 className="stats-number">{displayPackages}+</h2>
              <p className="stats-text">Paket Wisata</p>
            </div>
            <div className="col-6 col-md-3 anim-fade-up delay-1">
              <h2 className="stats-number">{displayRating}</h2>
              <p className="stats-text">Rating Pengguna</p>
            </div>
            <div className="col-6 col-md-3 anim-fade-up delay-2">
              <h2 className="stats-number">{displayGuide}%</h2>
              <p className="stats-text">Pemandu Lokal</p>
            </div>
          </div>
        </div>

      </div>

      {/* --- 3. DESTINASI POPULER --- */}
      <div style={{ 
        backgroundImage: 'url(https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e9364312-445e-4870-9d1b-1488a6444493)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center top', 
        paddingBottom: '200px',
        paddingTop: '160px',
        position: 'relative',
        zIndex: 1,
        marginTop: '-10px' 
      }}>
        <h2 className="text-center fw-bold text-white mb-5 display-5 position-relative" style={{ zIndex: 2, letterSpacing: '-1px' }}>Destinasi Populer</h2>
        <div className="container position-relative mt-5" style={{ zIndex: 2 }}>
          <div className="row justify-content-center g-4">
            {destinations.length > 0 ? destinations.map((dest) => (
              <div className="col-lg-3 col-md-6 anim-fade-up" key={dest.id}>
                
                <div 
                  className="bg-white p-3 rounded-4 shadow-lg h-100 d-flex flex-column btn-modern mx-auto" 
                  style={{ maxWidth: '280px', cursor: 'pointer' }}
                  onClick={() => setSelectedDest(dest)}
                >
                  <img 
                    src={dest.image_url || dest.image || dest.url || dest.foto || dest.link_foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f18210ee-4fe8-4f24-85cc-396dfcefe572"} 
                    className="w-100 rounded-3 mb-3 dest-card-img" 
                    alt={dest.name} 
                    style={{ height: '300px', objectFit: 'cover' }} 
                  />
                  <div className="text-center mt-auto pb-2">
                    <h5 className="fw-bold text-dark mb-0" style={{ textTransform: 'capitalize', letterSpacing: '-0.5px' }}>
                      {dest.name}
                    </h5>
                  </div>
                </div>

              </div>
            )) : (
              <p className="text-center fs-5 text-white">Memuat destinasi...</p>
            )}
          </div>
        </div>
      </div>

      {/* --- POPUP (MODAL) DESTINASI --- */}
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
              src={selectedDest.image_url || selectedDest.image || selectedDest.url || selectedDest.foto || selectedDest.link_foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f18210ee-4fe8-4f24-85cc-396dfcefe572"} 
              className="w-100 modal-img" 
              alt={selectedDest.name} 
            />
            
            <div className="p-4 p-md-5">
              <h3 className="fw-bold text-dark mb-3" style={{ textTransform: 'capitalize', letterSpacing: '-1px' }}>
                {selectedDest.name}
              </h3>
              <p className="text-secondary fs-6" style={{ lineHeight: '1.8' }}>
                {selectedDest.description || "Jelajahi keindahan alam yang memukau dan pengalaman tak terlupakan di destinasi ini. Tempat yang sempurna untuk melepas penat dan menikmati pesona alam eksotis Raja Ampat yang tiada duanya."}
              </p>
              
              <div className="mt-4 pt-2 text-end">
                <button onClick={() => setSelectedDest(null)} className="btn btn-dark rounded-pill px-4 py-2 fw-medium btn-modern">
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- 4. KENAPA PILIH KAMI --- */}
      <div className="container text-center py-5 my-5">
        <h2 className="fw-bold text-dark mb-3 display-5" style={{ letterSpacing: '-1px' }}>Kenapa Pilih Ampatheia?</h2>
        <p className="text-secondary mb-5 pb-4 fs-5">Rencanakan perjalanan ke Raja Ampat dengan lebih mudah, jelas, dan tanpa ribet.</p>
        
        <div className="row justify-content-center g-4 mt-2">
          {/* Item 1 */}
          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
            <div className="icon-circle shadow-sm">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </div>
            <div className="position-relative w-100 px-2">
              <h5 className="fw-bold text-dark fs-6 mb-3">Informasi Lengkap</h5>
              <p className="text-secondary small">Temukan semua informasi destinasi hingga paket wisata tanpa berpindah website.</p>
            </div>
          </div>
          
          {/* Item 2 */}
          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
            <div className="icon-circle shadow-sm">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>
              </svg>
            </div>
            <div className="position-relative w-100 px-2">
              <h5 className="fw-bold text-dark fs-6 mb-3">Pemandu Lokal Ahli</h5>
              <p className="text-secondary small">Didampingi oleh pemandu lokal berpengalaman yang mengenal Raja Ampat.</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
            <div className="icon-circle shadow-sm">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"/>
                <path d="M3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm0 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zm0 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z"/>
              </svg>
            </div>
            <div className="position-relative w-100 px-2">
              <h5 className="fw-bold text-dark fs-6 mb-3">Itinerary Terstruktur</h5>
              <p className="text-secondary small">Setiap perjalanan sudah dilengkapi dengan rencana harian yang jelas.</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
            <div className="icon-circle shadow-sm">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
            </div>
            <div className="position-relative w-100 px-2">
              <h5 className="fw-bold text-dark fs-6 mb-3">Review Nyata</h5>
              <p className="text-secondary small">Lihat ulasan dari wisatawan lain untuk membantu Anda memilih paket.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 5. PAKET WISATA UNGGULAN --- */}
      <div className="py-5" style={{ backgroundImage: 'url(https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/82cb2b10-1cc7-49a7-a532-2199555f52ec)', backgroundSize: 'cover', backgroundPosition: 'top' }}>
        <h2 className="text-center fw-bold text-dark mb-3 display-5" style={{ marginTop: '60px', letterSpacing: '-1px' }}>Paket Wisata Unggulan</h2>
        <p className="text-center text-secondary mb-5 pb-4 fs-5">Temukan paket wisata terbaik untuk pengalaman tak terlupakan</p>
        
        <div className="container pb-5">
          <div className="row justify-content-center g-4">
            {packages.length > 0 ? packages.map((pkg) => (
              <div className="col-lg-4 col-md-6" key={pkg.id}>
                <div className="bg-white pb-3 rounded-4 shadow-sm h-100 d-flex flex-column btn-modern">
                  <img 
                    src={pkg.image_url || pkg.image || pkg.url || pkg.foto || pkg.link_foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d1c0314e-4df9-4276-a86b-6c9acabc800d"} 
                    className="w-100 mb-3" 
                    style={{ height: '240px', objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} 
                    alt={pkg.title} 
                  />
                  <h5 className="fw-bold text-dark px-4 mb-2">{pkg.title}</h5>
                  <div className="d-flex px-4 mb-4 gap-4 text-secondary small fw-medium">
                    <span>⭐ 4.9</span>
                    <span>{pkg.duration || '7 Hari/6 Malam'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center px-4 mt-auto">
                    <span className="fw-bold text-dark fs-5">Rp {Number(pkg.price).toLocaleString('id-ID')}</span>
                    <button 
                      className="btn fw-semibold px-3 py-2 border-0 rounded-pill" 
                      style={{ backgroundColor: '#FFB76C', color: '#000' }}
                      onClick={() => navigate(`/detail/${pkg.id}`, { state: { packageData: pkg } })}
                    >
                      Pesan
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center fs-5 text-secondary">Belum ada paket wisata unggulan saat ini.</p>
            )}
          </div>
        </div>
      </div>

      {/* --- 6. TESTIMONI & GALERI (TERHUBUNG KE API REVIEWS) --- */}
      <div className="container text-center py-5 my-5">
        <h2 className="fw-bold text-dark mb-3 display-5" style={{ letterSpacing: '-1px' }}>Apa Kata Mereka?</h2>
        <p className="text-secondary mb-5 pb-4 fs-5">Pengalaman nyata dari wisatawan yang telah menjelajahi Raja Ampat</p>
        
        <div className="row justify-content-center g-4 mb-5 pb-5">
          {reviews.length > 0 ? reviews.map((review) => (
            <div className="col-lg-4 col-md-6" key={review.id}>
              <div className="bg-white p-4 shadow-sm h-100 anim-fade-up d-flex flex-column justify-content-center" style={{ border: '4px solid #FFB76C', borderRadius: '15px' }}>
                <div className="mb-3 text-warning fs-5">
                  {"⭐".repeat(review.rating || 5)}
                </div>
                <p className="text-secondary small fst-italic mb-3">
                  "{review.comment || review.pesan || "Pelayanan yang sangat memuaskan. Raja Ampat sungguh indah!"}"
                </p>
                <h6 className="fw-bold text-dark mb-0">— {review.user_name || review.name || "Wisatawan"}</h6>
              </div>
            </div>
          )) : (
            // Kotak abu-abu jika database Review kosong
            [1, 2, 3].map((item) => (
              <div className="col-lg-4 col-md-6" key={item}>
                <div className="w-100 shadow-sm" style={{ height: '200px', backgroundColor: '#D9D9D9', border: '4px solid #FFB76C', borderRadius: '15px' }}></div>
              </div>
            ))
          )}
        </div>

        <h2 className="fw-bold text-dark mb-5 mt-5 display-5" style={{ letterSpacing: '-1px' }}>Galeri Pengunjung</h2>
        
        <div className="row justify-content-center g-3 mb-5 pb-5">
          {galleries.length > 0 ? galleries.map((item, index) => {
            const borderColor = (index % 2 === 0) ? '#6AECE1' : '#FFB76C';
            return (
              <div className="col-lg-3 col-md-4 col-6 anim-fade-up" key={item.id || index} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="gallery-wrap shadow-sm" style={{ border: `4px solid ${borderColor}` }}>
                  <img 
                    src={item.image_url || item.image || item.url || item.foto || item.link_foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f18210ee-4fe8-4f24-85cc-396dfcefe572"} 
                    className="w-100" 
                    alt={`Galeri ${index + 1}`} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                </div>
              </div>
            );
          }) : (
            <p className="text-center fs-5 text-secondary">Memuat galeri...</p>
          )}
        </div>
      </div>

      {/* --- AREA FORM KONTAK (DIPISAH DARI FOOTER AGAR LOGIKA AMAN) --- */}
      <div className="container py-5 my-5 border-bottom" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <div className="row align-items-center mb-5 pb-5">
          <div className="col-lg-5 mb-4 mb-lg-0 pe-lg-4">
            <h2 className="fw-bold text-dark display-6 mb-3" style={{ letterSpacing: '-1px' }}>Punya Pertanyaan?</h2>
            <p className="text-secondary fs-5">Kirimkan pesan Anda dan tim kami akan segera menghubungi Anda untuk merencanakan liburan impian ke Raja Ampat.</p>
          </div>
          <div className="col-lg-7">
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border" style={{ borderColor: 'rgba(0,0,0,0.03)', minHeight: '300px' }}>
              
              {isSuccess ? (
                <div className="text-center py-4 anim-pop-in">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" style={{ width: '80px', height: '80px', backgroundColor: '#E8F5E9', color: '#4CAF50' }}>
                    <svg width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    </svg>
                  </div>
                  <h3 className="fw-bold text-dark mb-3">Pesan Terkirim!</h3>
                  <p className="text-secondary mb-4 px-lg-4">Terima kasih telah menghubungi kami. Tim Ampatheia akan segera merespons pesan Anda melalui email.</p>
                  <button 
                    onClick={() => setIsSuccess(false)} 
                    className="btn btn-outline-dark fw-semibold px-4 py-2 rounded-pill btn-modern"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input type="text" name="name" value={contactForm.name} onChange={handleContactChange} className="form-control bg-light border-0 py-2 px-3 form-control-custom" placeholder="Nama Lengkap" required />
                    </div>
                    <div className="col-md-6">
                      <input type="email" name="email" value={contactForm.email} onChange={handleContactChange} className="form-control bg-light border-0 py-2 px-3 form-control-custom" placeholder="Email Anda" required />
                    </div>
                    <div className="col-12">
                      <textarea name="message" value={contactForm.message} onChange={handleContactChange} className="form-control bg-light border-0 py-2 px-3 form-control-custom" rows="3" placeholder="Tulis pesan atau pertanyaan..." required></textarea>
                    </div>
                    <div className="col-12 text-end mt-3">
                      <button type="submit" disabled={isSubmitting} className="btn btn-modern fw-semibold px-4 py-2 border-0 rounded-pill" style={{ backgroundColor: isSubmitting ? '#ccc' : '#FFB76C', color: '#000' }}>
                        {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* --- 7. FOOTER BESAR (SESUAI DESAIN GAMBAR CYAN / TURQUOISE) --- */}
      <div style={{ position: 'relative', marginTop: '50px', width: '100%', overflow: 'hidden' }}>
        
        {/* SVG OMBAK (Wave Shape) */}
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto', marginBottom: '-1px' }}>
          <path fill="#70E6D6" d="M0,32L48,48C96,64,192,96,288,101.3C384,107,480,85,576,64C672,43,768,21,864,21.3C960,21,1056,43,1152,58.7C1248,75,1344,85,1392,90.7L1440,96L1440,121L0,121Z"></path>
        </svg>
        
        {/* KONTEN FOOTER */}
        <footer className="pt-0 pb-4" style={{ backgroundColor: '#70E6D6' }}>
          <div className="container py-4">
            <div className="row g-4 text-center justify-content-center">
              
              {/* Kolom 1: Ampatheia */}
              <div className="col-lg-4 px-lg-3">
                <h3 className="fw-bold mb-4 text-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Ampatheia</h3>
                <p className="small text-dark fw-medium" style={{ lineHeight: '1.8' }}>
                  Ampatheia hadir untuk memudahkan perjalanan wisata Anda ke Raja Ampat. Temukan paket wisata lengkap, itinerary terstruktur, dan pemandu lokal terpercaya dalam satu platform.
                </p>
              </div>

              {/* Kolom 2: Tautan */}
              <div className="col-lg-2 px-lg-3">
                <h5 className="fw-bold mb-4 text-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Tautan</h5>
                <ul className="list-unstyled small fw-medium text-dark" style={{ lineHeight: '2.5' }}>
                  <li><Link to="/" className="text-dark text-decoration-none nav-link-custom">Beranda</Link></li>
                  <li><Link to="/tour-packages" className="text-dark text-decoration-none nav-link-custom">Paket Wisata</Link></li>
                  <li><Link to="#" className="text-dark text-decoration-none nav-link-custom">Blog</Link></li>
                </ul>
              </div>

              {/* Kolom 3: Hubungi Kami */}
              <div className="col-lg-3 px-lg-3">
                <h5 className="fw-bold mb-4 text-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Hubungi Kami</h5>
                <ul className="list-unstyled small fw-medium text-dark" style={{ lineHeight: '2.5' }}>
                  <li>Email: info@ampatheia.com</li>
                  <li>Telepon: +62 812-3456-7890</li>
                  <li>Alamat: Jakarta, Indonesia</li>
                </ul>
              </div>

              {/* Kolom 4: Ikuti Kami */}
              <div className="col-lg-3 px-lg-3">
                <h5 className="fw-bold mb-4 text-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Ikuti Kami</h5>
                <div className="d-flex flex-column align-items-center gap-3 small fw-medium text-dark mt-3">
                  <a href="#" className="text-dark text-decoration-none d-flex align-items-center gap-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    ampatheia.id
                  </a>
                  <a href="#" className="text-dark text-decoration-none d-flex align-items-center gap-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                    </svg>
                    ampatheia.id
                  </a>
                  <a href="#" className="text-dark text-decoration-none d-flex align-items-center gap-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8c4.408 0 8-3.584 8-8s-3.584-8-8-8zm5.284 3.688a6.802 6.802 0 0 1 1.545 4.251c-.226-.043-2.482-.503-4.755-.217-.052-.112-.096-.234-.148-.355-.138-.33-.295-.668-.451-.99 2.516-1.023 3.662-2.498 3.81-2.69zM8 1.18c1.735 0 3.323.65 4.53 1.718-.122.174-1.155 1.553-3.584 2.464-1.12-2.056-2.36-3.74-2.551-4A6.95 6.95 0 0 1 8 1.18zm-2.907.642A43.123 43.123 0 0 1 7.627 5.77c-3.118.85-6.704.683-6.936.672a6.809 6.809 0 0 1 4.402-4.62zm-3.89 6.096c.22.003 3.65.177 6.818-.886.166.36.32.723.456 1.087-4.41.9-8.152.92-8.396.92a6.837 6.837 0 0 1 .122-1.121zm.842 3.568c.205-.008 3.73-.043 8.016-1.05.28.66.505 1.35.666 2.05a6.84 6.84 0 0 1-8.682-1zM8 14.82c-1.39 0-2.686-.42-3.766-1.139.11-.005 3.308-.04 7.551-1.01.2.628.344 1.28.423 1.956A6.846 6.846 0 0 1 8 14.82zm4.566-2.483c-.08-.66-.23-1.3-.432-1.916 2.378-.407 4.512-.132 4.708-.098a6.837 6.837 0 0 1-4.276 2.014z"/>
                    </svg>
                    ampatheia.id
                  </a>
                </div>
              </div>
              
            </div>

            <div className="text-center pt-5 mt-3">
              <span className="small text-dark fw-medium">Copyright © 2026 Ampatheia. Hak cipta dilindungi</span>
            </div>

          </div>
        </footer>
      </div>

    </div>
  );
};

export default Home;