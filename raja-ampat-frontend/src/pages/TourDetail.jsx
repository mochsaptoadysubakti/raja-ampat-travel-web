import React, { useState, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState('itinerary'); // Set default ke Itinerary
  const [currentImgIndex, setCurrentImgIndex] = useState(0); 
  const [pax, setPax] = useState(1); 
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
        const response = await axios.get('http://localhost:5000/api/itinerary');
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
        const response = await axios.get('http://localhost:5000/api/destinations');
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

  const handleBooking = () => {
    alert(`Mengarahkan ke pemesanan paket:\n${title}\nJumlah: ${pax} Orang\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}`);
  };

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

  // --- DATA PAKET ---
  const title = pkgDetail?.title || pkgDetail?.nama_paket || "Detail Paket";
  const duration = pkgDetail?.duration || pkgDetail?.durasi || "-";
  const price = Number(pkgDetail?.price || pkgDetail?.harga || 0);
  const description = pkgDetail?.description || pkgDetail?.deskripsi || pkgDetail?.fasilitas || "Tidak ada deskripsi.";
  const category = pkgDetail?.category || pkgDetail?.kategori || "Premium";
  const coverImage = pkgDetail?.image_url || pkgDetail?.image || pkgDetail?.url || pkgDetail?.foto || pkgDetail?.link_foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4edd24f0-cd5b-4271-a94e-add9f4430f2a";

  // --- LOGIKA MENCARI GAMBAR DESTINASI UNTUK GALERI ---
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

  // --- LOGIKA BOOKING ---
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
          .price-val { font-size: 1.8rem; font-weight: 800; color: #005B5C; letter-spacing: -1px; }
          
          .counter-btn { background: #F9FAFB; border: 1px solid #E5E7EB; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; }
          .counter-input { width: 60px; text-align: center; border: 1px solid #E5E7EB; border-left: none; border-right: none; font-weight: 600; background: #fff; }

          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .anim-fade-up { animation: fadeInUp 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          
          @media (max-width: 991px) {
            .booking-card { position: relative; top: 0; margin-top: 40px; }
            .gallery-main { height: 250px; }
          }
        `}
      </style>

      {/* NAVBAR */}
      <nav className="navbar py-3 fixed-top" style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', zIndex: 999 }}>
        <div className="container-fluid px-4 px-lg-5 d-flex align-items-center">
          <Link className="navbar-brand brand-text fs-3" style={{ color: '#111' }} to="/">
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

            {/* 3. TABS */}
            <div className="tab-container mt-4">
              <div className={`tab-item ${activeTab === 'deskripsi' ? 'active' : ''}`} onClick={() => setActiveTab('deskripsi')}>Deskripsi & Fasilitas</div>
              <div className={`tab-item ${activeTab === 'itinerary' ? 'active' : ''}`} onClick={() => setActiveTab('itinerary')}>Itinerary</div>
            </div>

            {/* KONTEN TAB */}
            {activeTab === 'deskripsi' && (
              <div className="anim-fade-up pt-2">
                <h4 className="fw-bold mb-3 text-dark">Tentang Paket Wisata</h4>
                <p className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{description}</p>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="anim-fade-up pt-2">
                <h4 className="fw-bold mb-4 text-dark">Rencana Perjalanan</h4>
                {processedItinerary.length > 0 ? (
                  processedItinerary.map((item, idx) => (
                    <div className="d-flex mb-4 pb-3 border-bottom" key={idx}>
                      <div className="me-3 me-md-4">
                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
                          {item.day}
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-2 text-dark">Hari {item.day}: {item.name}</h5>
                        {/* KUNCI PERBAIKANNYA ADA DI SINI: whiteSpace: 'pre-line' */}
                        <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                          {item.activity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted fst-italic">Jadwal perjalanan belum tersedia.</p>
                )}
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
                <input type="date" className="form-control bg-white py-2 border" style={{ borderRadius: '8px' }} />
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
                  <span className="fw-bold" style={{ color: '#005B5C', fontSize: '1.1rem' }}>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button className="btn w-100 py-3 rounded-3 fw-bold text-white fs-5 border-0" style={{ backgroundColor: '#FF6B2C' }} onClick={handleBooking}>
                Pesan Sekarang
              </button>
              <p className="text-center text-muted small mt-3 mb-0" style={{ fontSize: '0.75rem' }}>Gratis pembatalan hingga 7 hari sebelum keberangkatan.</p>
            </div>
          </div>

        </div>
      </div>
      
      <footer className="py-4 mt-5" style={{ backgroundColor: '#fff', borderTop: '1px solid #E5E7EB' }}>
        <div className="container text-center">
          <p className="small text-secondary fw-medium mb-0">Copyright © 2026 Ampatheia. Hak Cipta Dilindungi.</p>
        </div>
      </footer>

    </div>
  );
};

export default TourDetail;