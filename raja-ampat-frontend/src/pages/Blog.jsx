import React, { useState, useEffect } from "react";
import axiosInstance from "axios"; // Menggunakan axios standar seperti kode Anda
import { Link, useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  // --- STATE DATA ---
  const [allBlogs, setAllBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

    // Fetch Artikel Blog
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:5000/api/blogs'); 
        const dataArray = response.data?.data || response.data || [];
        if (Array.isArray(dataArray)) {
          setAllBlogs(dataArray);
          setFilteredBlogs(dataArray);
        }
      } catch (error) {
        console.error("Gagal memuat data Blog:", error.message);
      }
    };

    fetchBlogs();
  }, []);

  // --- LOGIKA PENCARIAN ARTIKEL ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBlogs(allBlogs);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allBlogs.filter(blog => 
        (blog.title && blog.title.toLowerCase().includes(query)) ||
        (blog.category && blog.category.toLowerCase().includes(query)) ||
        (blog.description && blog.description.toLowerCase().includes(query))
      );
      setFilteredBlogs(filtered);
    }
  }, [searchQuery, allBlogs]);

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
    if (!text) return "Discover the most breathtaking locations and stories in the world's most biodiverse marine ecosystem.";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Tentukan Artikel Utama (Sorotan) - Ambil item pertama
  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  // Sisanya masuk ke Grid
  const gridBlogs = filteredBlogs.length > 1 && !searchQuery ? filteredBlogs.slice(1) : filteredBlogs;

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', overflowX: 'hidden', paddingTop: '70px' }}>
      
      {/* --- INJEKSI CSS KHUSUS BLOG --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');

          body, p, a, span, input { font-family: 'Inter', sans-serif; }
          h1, h2, h3, h4, h5, .brand-text { font-family: 'Poppins', sans-serif; }

          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .anim-fade-up { animation: fadeInUp 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          
          .nav-link-custom { transition: color 0.3s ease; color: #555; }
          .nav-link-custom:hover { color: #000 !important; }

          /* HERO SECTION BLOG */
          .blog-hero {
            background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/9d90b560-2bff-4520-aa51-132810017c74');
            background-size: cover;
            background-position: center;
            padding: 140px 0 100px 0;
            text-align: center;
            color: white;
            border-radius: 0 0 40px 40px;
            margin-bottom: 40px;
          }
          .blog-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 15px; letter-spacing: -1px; }
          .blog-hero p { font-size: 1.2rem; max-width: 600px; margin: 0 auto; opacity: 0.9; line-height: 1.6; }

          /* FEATURED BLOG CARD (Besar) */
          .featured-blog-card { background: #fff; border-radius: 24px; overflow: hidden; display: flex; box-shadow: 0 15px 35px rgba(0,0,0,0.08); margin-bottom: 50px; cursor: pointer; transition: transform 0.3s; border: 1px solid #f0f0f0; }
          .featured-blog-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
          .featured-blog-img-wrap { width: 55%; position: relative; overflow: hidden; }
          .featured-blog-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s; min-height: 400px; }
          .featured-blog-card:hover .featured-blog-img { transform: scale(1.05); }
          .featured-blog-content { width: 45%; padding: 50px 40px; display: flex; flex-direction: column; justify-content: center; }
          
          /* GRID BLOG CARD */
          .blog-card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.04); transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; cursor: pointer; border: 1px solid #f5f5f5; }
          .blog-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: #FFB76C; }
          .blog-img-wrap { position: relative; height: 220px; width: 100%; overflow: hidden; }
          .blog-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
          .blog-card:hover .blog-img { transform: scale(1.08); }
          
          .blog-badge { position: absolute; top: 15px; left: 15px; background: rgba(255,255,255,0.95); padding: 6px 15px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; color: #111; z-index: 2; text-transform: uppercase; letter-spacing: 1px;}
          .blog-content { padding: 25px; flex: 1; display: flex; flex-direction: column; }
          .blog-author-row { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; font-size: 0.85rem; color: #64748B; font-weight: 500; }
          .blog-author-img { width: 28px; height: 28px; border-radius: 50%; }
          .blog-title { font-size: 1.25rem; font-weight: 700; color: #111; margin-bottom: 12px; line-height: 1.4; }
          .blog-desc { color: #64748B; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px; }
          .blog-readmore { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #111; margin-top: auto; font-size: 0.9rem; transition: color 0.3s;}
          .blog-card:hover .blog-readmore { color: #FFB76C; }
          
          /* SEARCH BAR */
          .search-container { background: #fff; border-radius: 50px; padding: 8px 15px 8px 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); display: flex; align-items: center; max-width: 700px; margin: 0 auto 50px auto; border: 1px solid #eee; }
          .search-input { border: none; outline: none; width: 100%; font-size: 1rem; color: #333; background: transparent; }
          .search-btn { background: #111; color: #fff; border: none; border-radius: 40px; padding: 12px 30px; font-weight: 600; transition: all 0.3s; }
          .search-btn:hover { background: #FFB76C; color: #111; }

          /* MODAL LOGOUT */
          .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); z-index: 1050; display: flex; justify-content: center; align-items: center; padding: 20px; opacity: 0; animation: fadeInModal 0.3s forwards; }
          .modal-content-small { background-color: #fff; border-radius: 20px; max-width: 400px; width: 100%; padding: 40px 20px; text-align: center; transform: scale(0.9); animation: scaleUpModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
          @keyframes fadeInModal { to { opacity: 1; } }
          @keyframes scaleUpModal { to { transform: scale(1); } }
          .spinner-custom { width: 50px; height: 50px; border: 4px solid rgba(255, 183, 108, 0.3); border-top-color: #FFB76C; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto; }
          @keyframes spin { 100% { transform: rotate(360deg); } }

          /* MOBILE RESPONSIVE */
          @media (max-width: 991px) {
            .blog-hero h1 { font-size: 2.5rem; }
            .featured-blog-card { flex-direction: column; }
            .featured-blog-img-wrap { width: 100%; height: 250px; }
            .featured-blog-img { min-height: 250px; }
            .featured-blog-content { width: 100%; padding: 30px; }
            .search-container { flex-direction: column; border-radius: 20px; padding: 15px; }
            .search-input { margin-bottom: 10px; padding: 5px; text-align: center; }
            .search-btn { width: 100%; }
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

      {/* --- NAVBAR MODERN KONSISTEN --- */}
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
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/destinasi">Destinasi</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom fw-bold text-dark" to="/blog">Blog</Link>
            
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
        <div className="blog-hero">
          <h1>Travel Blog & Stories</h1>
          <p>Get inspired by travel stories, tips, and guides from Raja Ampat.</p>
        </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="container pb-5 mb-5" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* --- FEATURED BLOG (SOROTAN ARTIKEL UTAMA) --- */}
        {featuredBlog && !searchQuery && (
          /* --- PERUBAHAN: Mengubah onClick agar melakukan navigate ke rute detail blog --- */
          <div className="featured-blog-card anim-fade-up" style={{ animationDelay: '0.1s' }} onClick={() => navigate(`/blog/${featuredBlog.id}`)}>
            <div className="featured-blog-img-wrap">
              <img 
                src={featuredBlog.image_url || featuredBlog.image || featuredBlog.foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/7454272c-e62f-44c0-b6b3-bf8bdcfa8120"} 
                alt={featuredBlog.title} 
                className="featured-blog-img" 
              />
            </div>
            <div className="featured-blog-content">
              <div className="blog-author-row mb-3">
                <span className="badge px-3 py-2 rounded-pill" style={{ backgroundColor: '#FFB76C', color: '#111', fontWeight: 700, letterSpacing: '1px' }}>
                  {featuredBlog.category || "SOROTAN UTAMA"}
                </span>
                <span className="ms-2">{featuredBlog.date || "Terbaru"}</span>
              </div>
              <h1 className="fw-bold mb-3 display-6" style={{ letterSpacing: '-1px' }}>
                {featuredBlog.title || "Raja Ampat: Surga Bawah Laut Indonesia"}
              </h1>
              <p className="fs-6 text-secondary mb-4" style={{ lineHeight: '1.8' }}>
                {featuredBlog.description || "Menyelami keindahan Raja Ampat, rumah bagi keanekaragaman hayati laut terbesar di dunia. Temukan rahasia tersembunyi di balik perairan biru kristalnya."}
              </p>
              <div className="d-flex align-items-center gap-2 text-dark fw-bold mt-auto" style={{ fontSize: '1rem' }}>
                Read More 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* --- SEARCH BAR --- */}
        <div className="search-container anim-fade-up" style={{ animationDelay: '0.2s' }}>
          <i className="bi bi-search text-muted ms-2 me-3 fs-5"></i>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search articles, destinations, diving, tips..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn d-none d-md-block">Cari</button>
        </div>

        {/* --- GRID ARTIKEL --- */}
        <div className="row g-4 mt-2">
          {gridBlogs.length > 0 ? gridBlogs.map((blog, index) => (
            <div className="col-lg-4 col-md-6 anim-fade-up" key={blog.id || index} style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}>
              {/* --- PERUBAHAN: Mengubah onClick agar melakukan navigate ke rute detail blog berdasarkan blog.id --- */}
              <div className="blog-card" onClick={() => navigate(`/blog/${blog.id}`)}>
                
                <div className="blog-img-wrap">
                  <span className="blog-badge">{blog.category || "Travel & Tips"}</span>
                  <img 
                    src={blog.image_url || blog.image || blog.foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ba9615c7-85a2-470e-b578-6229f7cfca1f"} 
                    alt={blog.title} 
                    className="blog-img"
                  />
                </div>
                
                <div className="blog-content">
                  <div className="blog-author-row">
                    <img src={`https://ui-avatars.com/api/?name=${blog.author || 'Admin'}&background=F3F4F6&color=666`} className="blog-author-img" alt="Author"/>
                    <span>{blog.author || "Tim Ampatheia"}</span>
                    <span>•</span>
                    <span>{blog.date || "March 15, 2026"}</span>
                  </div>
                  
                  <h3 className="blog-title">{blog.title || "Top 10 Diving Spots in Raja Ampat"}</h3>
                  <p className="blog-desc">{truncateText(blog.content || blog.description, 100)}</p>
                  
                  <div className="blog-readmore">
                    Read more 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

              </div>
            </div>
          )) : (
            <div className="col-12 text-center py-5">
              <div className="mb-3" style={{ fontSize: '3rem', opacity: '0.3' }}>📝</div>
              <h4 className="text-secondary fw-semibold mb-2">Artikel tidak ditemukan</h4>
              <p className="text-muted">Coba cari dengan kata kunci lain atau periksa koneksi backend Anda.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- FOOTER KONSISTEN --- */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto', marginBottom: '-1px' }}>
          <path fill="#70E6D6" d="M0,32L48,48C96,64,192,96,288,101.3C384,107,480,85,576,64C672,43,768,21,864,21.3C960,21,1056,43,1152,58.7C1248,75,1344,85,1392,90.7L1440,96L1440,121L0,121Z"></path>
        </svg>
        <footer className="pt-0 pb-4" style={{ backgroundColor: '#70E6D6' }}>
          <div className="container py-4">
            <div className="row g-4 text-center justify-content-center">
              <div className="col-lg-4 px-lg-3">
                <h3 className="fw-bold mb-4 text-dark brand-text">Ampatheia</h3>
                <p className="small text-dark fw-medium" style={{ lineHeight: '1.8' }}>
                  Ampatheia hadir untuk memudahkan perjalanan wisata Anda ke Raja Ampat. Temukan paket wisata lengkap, itinerary terstruktur, dan pemandu lokal terpercaya dalam satu platform.
                </p>
              </div>
              <div className="col-lg-2 px-lg-3">
                <h5 className="fw-bold mb-4 text-dark brand-text">Tautan</h5>
                <ul className="list-unstyled small fw-medium text-dark" style={{ lineHeight: '2.5' }}>
                  <li><Link to="/" className="text-dark text-decoration-none nav-link-custom">Beranda</Link></li>
                  <li><Link to="/tour-packages" className="text-dark text-decoration-none nav-link-custom">Paket Wisata</Link></li>
                  <li><Link to="/destinasi" className="text-dark text-decoration-none nav-link-custom">Destinasi</Link></li>
                  <li><Link to="/blog" className="text-dark text-decoration-none nav-link-custom">Blog</Link></li>
                </ul>
              </div>
              <div className="col-lg-3 px-lg-3">
                <h5 className="fw-bold mb-4 text-dark brand-text">Hubungi Kami</h5>
                <ul className="list-unstyled small fw-medium text-dark" style={{ lineHeight: '2.5' }}>
                  <li>Email: info@ampatheia.com</li>
                  <li>Telepon: +62 812-3456-7890</li>
                  <li>Alamat: Jakarta, Indonesia</li>
                </ul>
              </div>
              <div className="col-lg-3 px-lg-3">
                <h5 className="fw-bold mb-4 text-dark brand-text">Ikuti Kami</h5>
                <div className="d-flex flex-column align-items-center gap-3 small fw-medium text-dark mt-3">
                  <a href="#" className="text-dark text-decoration-none d-flex align-items-center gap-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15 pipe h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                    ampatheia.id
                  </a>
                  <a href="#" className="text-dark text-decoration-none d-flex align-items-center gap-2">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
                    ampatheia.id
                  </a>
                </div>
              </div>
              <div className="text-center pt-5 mt-3">
                <span className="small text-dark fw-medium">Copyright © 2026 Ampatheia. Hak cipta dilindungi</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
};

export default Blog;