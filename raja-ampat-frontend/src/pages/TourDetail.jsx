import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebook, FaGlobe } from "react-icons/fa";
import axios from "axios";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";

const TourDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- STATE DATA ---
  const [pkgDetail, setPkgDetail] = useState(location.state?.packageData || null);
  const [itineraryList, setItineraryList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  
  const [isLoading, setIsLoading] = useState(!location.state?.packageData); 
  const [error, setError] = useState("");
  
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('deskripsi'); 
  const [currentImgIndex, setCurrentImgIndex] = useState(0); 
  const [pax, setPax] = useState(1); 
  const [bookingDate, setBookingDate] = useState(""); // State untuk tanggal
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); 

    const storedUser = localStorage.getItem('userData');
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchPackageDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tour_packages/${id}`);
        let data = response.data?.data || response.data;
        if (Array.isArray(data)) data = data.length > 0 ? data[0] : null;
        setPkgDetail(data);
      } catch (err) {
        console.error("Gagal memuat detail paket:", err);
        setError("Gagal memuat detail paket dari API.");
      }
    };

    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/itinerary`);
        let allData = response.data?.data || response.data || [];
        if (!Array.isArray(allData)) allData = []; 

        const filtered = allData.filter(item => 
          item?.tour_package_id == id || item?.package_id == id || item?.tour_id == id
        );
        const sorted = filtered.sort((a, b) => (a.day || a.hari || 0) - (b.day || b.hari || 0));
        setItineraryList(sorted);
      } catch (err) {
        console.error("Gagal memuat itinerary:", err);
      }
    };

    const fetchDestinations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/destinations`);
        let data = response.data?.data || response.data || [];
        if (!Array.isArray(data)) data = [];
        setDestinationList(data);
      } catch (err) {
        console.error("Gagal memuat destinasi:", err);
      }
    };

    Promise.all([
      !pkgDetail ? fetchPackageDetail() : Promise.resolve(),
      fetchItinerary(),
      fetchDestinations()
    ]).finally(() => {
      setIsLoading(false);
    });

  }, [id, pkgDetail]);

  // =======================================================
  // --- PERUBAHAN LOGIKA BOOKING ---
  // =======================================================
  const handleBooking = () => {
    // 1. Validasi Tanggal
    if (!bookingDate) {
        alert("Silakan pilih tanggal keberangkatan terlebih dahulu!");
        return;
    }
    
    // 2. Pastikan ID Paket tersedia
    const packageId = id || pkgDetail?.id;
    if (!packageId) {
        alert("Terjadi kesalahan, ID Paket tidak ditemukan.");
        return;
    }

    // 3. Pindah ke halaman detail booking dengan membawa data (state)
    navigate(`/booking/${packageId}`, {
        state: {
            selectedDate: bookingDate,
            totalPax: pax,
            packageData: pkgDetail
        }
    });
  };
  // =======================================================

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" style={{ color: '#FFB76C', width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
      </div>
    );
  }

  // --- DATA PAKET UMUM ---
  const title = pkgDetail?.title || pkgDetail?.nama_paket || "Detail Paket";
  const duration = pkgDetail?.duration || pkgDetail?.durasi || "-";
  const price = Number(pkgDetail?.price || pkgDetail?.harga || 0);
  const category = pkgDetail?.category || pkgDetail?.kategori || "Premium";
  const coverImage = pkgDetail?.image_url || pkgDetail?.image || pkgDetail?.url || pkgDetail?.foto || pkgDetail?.link_foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4edd24f0-cd5b-4271-a94e-add9f4430f2a";

  // --- PARSING DESKRIPSI & FASILITAS ---
  const rawDescription = pkgDetail?.description || pkgDetail?.deskripsi || "Tidak ada deskripsi.";
  let cleanDesc = rawDescription;
  let includedList = [];
  let excludedList = [];

  if (rawDescription.includes("---DESKRIPSI---")) {
    try {
      const parts = rawDescription.split("---INCLUDED---");
      cleanDesc = parts[0].replace("---DESKRIPSI---\n", "").replace("---DESKRIPSI---", "").trim();
      
      if (parts[1]) {
        const subParts = parts[1].split("---EXCLUDED---");
        includedList = subParts[0].trim().split("\n").filter(line => line.trim() !== "");
        excludedList = subParts[1] ? subParts[1].trim().split("\n").filter(line => line.trim() !== "") : [];
      }
    } catch (e) {
      console.error("Gagal parsing tag fasilitas:", e);
    }
  }

  // --- BAGIAN ITINERARY ---
  const processedItinerary = itineraryList.map((it, index) => {
    const nestedDest = it.destination || it.destinasi || {};
    let destName = nestedDest.name || nestedDest.nama || nestedDest.nama_destinasi || 
                   it.destination_name || it.nama_destinasi || it.destination || it.destinasi || "";
    let destImg = nestedDest.image_url || nestedDest.image || nestedDest.foto || 
                  it.image_url || it.foto || it.gambar || null;

    if (!destImg) {
      const destId = it.destination_id || it.id_destinasi || it.destinasi_id;
      const matchedById = destinationList.find(d => d.id == destId);
      if (matchedById) {
        destImg = matchedById.image_url || matchedById.image || matchedById.foto || matchedById.link_foto;
      }
    }

    if (!destImg && destName) {
      const matchedByName = destinationList.find(d => {
        const dName = String(d.name || d.nama || d.nama_destinasi || "").toLowerCase();
        return dName && dName.includes(destName.toLowerCase());
      });
      if (matchedByName) destImg = matchedByName.image_url || matchedByName.image || matchedByName.foto || matchedByName.link_foto;
    }

    return {
      day: it.day || it.hari || (index + 1),
      name: destName || "Destinasi Wisata",
      activity: it.description || it.aktivitas || it.activity || "Aktivitas bebas.",
      img: destImg
    };
  });

  // Gabungkan cover + gambar itinerary untuk Galeri Atas
  const itineraryImages = processedItinerary.map(item => item.img).filter(Boolean);
  const galleryImages = [...new Set([coverImage, ...itineraryImages])];

  const nextImg = () => setCurrentImgIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  const prevImg = () => setCurrentImgIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));

  // --- LOGIKA HARGA & JUMLAH ORANG ---
  const totalPrice = price * pax;
  const increasePax = () => setPax(prev => prev + 1);
  const decreasePax = () => setPax(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; }
          h1, h2, h3, h4, .brand-text { font-family: 'Poppins', sans-serif; }
          
          .gallery-main { position: relative; border-radius: 16px; overflow: hidden; height: 450px; background-color: #E5E7EB; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .gallery-main img { width: 100%; height: 100%; object-fit: cover; }
          .gallery-nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.9); border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.15); z-index: 2; color: #333; }
          .gallery-nav-btn.left { left: 15px; }
          .gallery-nav-btn.right { right: 15px; }
          
          .thumb-row { display: flex; gap: 12px; margin-top: 15px; overflow-x: auto; padding-bottom: 8px; }
          .thumb-img { width: 120px; height: 80px; object-fit: cover; border-radius: 10px; cursor: pointer; opacity: 0.5; transition: all 0.2s; border: 2px solid transparent; flex-shrink: 0; }
          .thumb-img.active { opacity: 1; border-color: #FFB76C; }

          .tab-container { display: flex; border-bottom: 2px solid #E5E7EB; margin-bottom: 30px; }
          .tab-item { padding: 12px 24px; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 600; color: #6B7280; transition: all 0.3s; margin-bottom: -2px;}
          .tab-item.active { color: #111; border-bottom-color: #FFB76C; }

          .booking-card { background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); position: sticky; top: 100px; border: 1px solid #F3F4F6; }
          .price-val { font-size: 1.8rem; font-weight: 800; color: #070A27; letter-spacing: -1px; }
          
          .counter-btn { background: #F9FAFB; border: 1px solid #E5E7EB; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; }
          .counter-input { width: 60px; text-align: center; border: 1px solid #E5E7EB; border-left: none; border-right: none; font-weight: 600; background: #fff; }

          .facility-list { list-style: none; padding: 0; margin: 0; }
          .facility-list li { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 0.95rem; color: #4A5568; line-height: 1.5; }
          .icon-inc { color: #2ecc71; font-weight: bold; font-size: 1.1rem; }
          .icon-exc { color: #e74c3c; font-weight: bold; font-size: 1.1rem; }

          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .anim-fade-up { animation: fadeInUp 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          
          @media (max-width: 991px) {
            .booking-card { position: relative; top: 0; margin-top: 40px; }
            .gallery-main { height: 250px; }
          }
          .timeline-wrapper{
            position: relative;
          }
          .timeline-item{
            display:flex;
            gap:32px;
            margin-bottom:48px;
          }
          .timeline-left{
            width:52px;
            display:flex;
            flex-direction:column;
            align-items:center;
            flex-shrink:0;
          }
          .timeline-circle{
            width:52px;
            height:52px;
            border-radius:50%;
            background:#67E8E0;
            color:#111827;
            font-weight:700;
            font-size:1.2rem;
          
            display:flex;
            align-items:center;
            justify-content:center;
          }
          .timeline-line{
            width:2px;
            flex:1;
            background:#D1D5DB;
            margin-top:8px;
            min-height:90px;
          }
          .timeline-content{
            flex:1;
            padding-top:4px;
          }
          .timeline-title{
            font-size:1.7rem;
            font-weight:700;
            color:#111827;
            margin-bottom:12px;
          }
          .timeline-desc{
            color:#374151;
            line-height:1.7;
            font-size:1.1rem;
            margin:0;
            white-space:pre-line;
          }
          
          @media(max-width:768px){
            .timeline-item{
              gap:20px;
            }
            .timeline-circle{
              width:42px;
              height:42px;
              font-size:1rem;
            }
            .timeline-title{
              font-size:1.2rem;
            }
            .timeline-desc{
              font-size:0.95rem;
            }
          }

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
        `}
      </style>

      {/* NAVBAR */}
      <nav className="navbar py-3 fixed-top" style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', zIndex: 999 }}>
        <div className="container-fluid px-4 px-lg-5 d-flex align-items-center">
          <Link className="navbar-brand fw-bold fs-3" style={{ color: '#111' }} to="/">
            Ampatheia<span style={{ color: '#FFB76C' }}>.</span>
          </Link>
          <div className="ms-auto d-flex align-items-center gap-4">
            <Link className="text-decoration-none fs-6 fw-medium text-dark" to="/tour-packages">Paket Wisata</Link>
            {user ? (
              <button onClick={handleLogout} className="btn btn-sm btn-outline-danger rounded-pill px-3">Keluar</button>
            ) : (
              <Link className="btn btn-sm btn-dark rounded-pill px-4" to="/login">Masuk</Link>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="container" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
        <div className="row g-lg-5 g-4">
          
          <div className="col-lg-8">
            {/* 1. GALERI FOTO */}
            <div className="mb-4">
              <div className="gallery-main">
                {galleryImages.length > 0 && <img src={galleryImages[currentImgIndex]} alt="Galeri Paket" />}
                {galleryImages.length > 1 && (
                  <>
                    <button onClick={prevImg} className="gallery-nav-btn left">❮</button>
                    <button onClick={nextImg} className="gallery-nav-btn right">❯</button>
                  </>
                )}
              </div>
              
              <div className="thumb-row">
                {galleryImages.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Thumb ${idx}`} 
                    className={`thumb-img ${idx === currentImgIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImgIndex(idx)}
                  />
                ))}
              </div>
            </div>

            {/* 2. HEADER INFO */}
            <div className="mb-4 mt-2">
              <span className="badge mb-3 px-3 py-2 rounded-pill" style={{ backgroundColor: '#FFB76C', color: '#111' }}>{category}</span>
              <h1 className="fw-bold display-6 mb-3 text-dark">{title}</h1>
              <div className="d-flex flex-wrap gap-4 fs-6 fw-medium text-secondary">
                <span>📍 Raja Ampat, Papua</span>
                <span>🕒 {duration}</span>
                <span>⭐ 5.0 (Review)</span>
              </div>
            </div>

            {/* 3. TABS MENU */}
            <div className="tab-container mt-4">
              <div className={`tab-item ${activeTab === 'deskripsi' ? 'active' : ''}`} onClick={() => setActiveTab('deskripsi')}>Deskripsi</div>
              <div className={`tab-item ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => setActiveTab('itinerary')}>Itinerary</div>
              <div className={`tab-item ${activeTab === 'fasilitas' ? 'active' : ''}`} onClick={() => setActiveTab('fasilitas')}>Fasilitas</div>
            </div>

            {/* KONTEN TAB: DESKRIPSI */}
            {activeTab === 'deskripsi' && (
              <div className="anim-fade-up pt-2">
                <h4 className="fw-bold mb-3 text-dark">Tentang Paket Wisata</h4>
                <p className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{cleanDesc}</p>
              </div>
            )}

            {/* KONTEN TAB: ITINERARY */}
            {activeTab === 'itinerary' && (
              <div className="anim-fade-up pt-2">
                <h2
                  className="fw-bold mb-5"
                  style={{
                    fontSize: '2rem',
                    color: '#111827'
                  }}
                >
                  Itinerary
                </h2>

                {processedItinerary.length > 0 ? (
                  <div className="timeline-wrapper">
                    {processedItinerary.map((item, idx) => (
                      <div
                        key={idx}
                        className="timeline-item"
                      >
                        <div className="timeline-left">
                          <div className="timeline-circle">
                            {item.day}
                          </div>

                          {idx !== processedItinerary.length - 1 && (
                            <div className="timeline-line"></div>
                          )}
                        </div>

                        <div className="timeline-content">
                          <h4 className="timeline-title">
                            Hari {item.day}: {item.name}
                          </h4>

                          <p className="timeline-desc">
                            {item.activity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">
                    Jadwal perjalanan belum tersedia.
                  </p>
                )}
              </div>
            )}

            {/* KONTEN TAB: FASILITAS */}
            {activeTab === 'fasilitas' && (
              <div className="anim-fade-up pt-2">
                <h4 className="fw-bold mb-4 text-dark">Fasilitas & Layanan Tour</h4>
                <div className="row g-4">
                  
                  {/* Kolom Kiri: Yang Termasuk */}
                  <div className="col-md-6">
                    <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#F0FFF4', border: '1px solid #C6F6D5' }}>
                      <h5 className="fw-bold mb-3" style={{ color: '#22543D' }}>Yang Termasuk</h5>
                      <ul className="facility-list">
                        {includedList.length > 0 ? (
                          includedList.map((item, idx) => (
                            <li key={idx}>
                              <span className="icon-inc">✓</span> <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-muted fst-italic">Data fasilitas tidak tersedia.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Kolom Kanan: Yang Tidak Termasuk */}
                  <div className="col-md-6">
                    <div className="p-4 rounded-3 h-100" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
                      <h5 className="fw-bold mb-3" style={{ color: '#742A2A' }}>Yang Tidak Termasuk</h5>
                      <ul className="facility-list">
                        {excludedList.length > 0 ? (
                          excludedList.map((item, idx) => (
                            <li key={idx}>
                              <span className="icon-exc">✕</span> <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-muted fst-italic">Data pengecualian tidak tersedia.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* KOLOM KANAN (BOOKING CARD) */}
          <div className="col-lg-4">
            <div className="booking-card">
              <h2 className="price-val mb-1">Rp {price.toLocaleString('id-ID')}</h2>
              <p className="text-secondary mb-4 pb-3 border-bottom">per orang</p>
              
              <div className="mb-4">
                <label className="fw-semibold text-dark small mb-2 d-flex align-items-center gap-2">🗓 Pilih Tanggal</label>
                <input 
                  type="date" 
                  className="form-control bg-white py-2 border" 
                  style={{ borderRadius: '8px' }} 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="fw-semibold text-dark small mb-2 d-flex align-items-center gap-2">👥 Jumlah Orang</label>
                <div className="d-flex align-items-center rounded-3 overflow-hidden border">
                  <button className="counter-btn" onClick={decreasePax}>-</button>
                  <input type="text" className="counter-input border-0" value={pax} readOnly />
                  <button className="counter-btn" onClick={increasePax}>+</button>
                </div>
              </div>

              <div className="bg-light p-3 rounded-3 mb-4 border">
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Rp {price.toLocaleString('id-ID')} × {pax} orang</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="d-flex justify-content-between pt-2 border-top">
                  <span className="fw-bold text-dark">Total</span>
                  <span className="fw-bold" style={{ color: '#070A27', fontSize: '1.1rem' }}>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button type="button" className="btn w-100 py-3 rounded-3 fw-bold text-black fs-5 border-0" style={{ backgroundColor: '#FFB76C' }} onClick={handleBooking}>
                Pesan Sekarang
              </button>
              <p className="text-center text-muted small mt-3 mb-0" style={{ fontSize: '0.75rem' }}>Gratis pembatalan hingga 7 hari sebelum keberangkatan.</p>
            </div>
          </div>

        </div>
      </div>
      
        {/* --- 7. FOOTER  --- */}
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

export default TourDetail;