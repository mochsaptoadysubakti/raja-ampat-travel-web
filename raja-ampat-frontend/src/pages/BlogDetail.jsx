import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaInstagram, FaFacebook, FaGlobe, FaUser, FaCalendarAlt } from "react-icons/fa";

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ✅ STATE UNTUK MENU MOBILE

    useEffect(() => {
        window.scrollTo(0, 0);

        // Ambil data user yang sedang login
        const storedUser = localStorage.getItem('userData');
        if (storedUser && storedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                console.error("Gagal parsing user:", e);
            }
        }

        const fetchBlogData = async () => {
            setLoading(true);
            try {
                // ✅ Gunakan variabel environment agar bisa diakses di Railway
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/blogs/${id}`);
                const data = res.data?.data || res.data;
                setBlog(data);

                // ✅ Gunakan variabel environment juga untuk artikel terkait
                const allRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/blogs`);
                const allData = allRes.data?.data || allRes.data || [];
                const filtered = Array.isArray(allData)
                    ? allData.filter((b) => String(b.id) !== String(id)).slice(0, 3)
                    : [];
                setRelatedBlogs(filtered);
            } catch (error) {
                console.error("Gagal memuat artikel:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBlogData();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setUser(null);
        navigate('/login');
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
            <div className="spinner-border" style={{ color: '#FFB76C', width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Memuat artikel...</span>
            </div>
        </div>
    );
    
    if (!blog) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
            Artikel tidak ditemukan.
        </div>
    );

    const title = blog.title || "Tanpa Judul";
    const content = blog.content || "Konten kosong.";
    const author = blog.author || "Admin";
    const category = blog.category || blog.kategori || null;
    const publishedAt = blog.created_at || blog.published_at || blog.date || null;
    const coverImage = blog.image_url || blog.image || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2b8a0d5b-4896-4b25-83f8-d93c96c26e77";

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');

                body { font-family: 'Inter', sans-serif; }
                h1, h2, h3, h4, h5, .brand-text { font-family: 'Poppins', sans-serif; }

                .blog-content-area { line-height: 1.9; color: #374151; font-size: 1rem; }
                .blog-content-area h1,
                .blog-content-area h2,
                .blog-content-area h3 { font-family: 'Poppins', sans-serif; font-weight: 700; margin-top: 1.8rem; margin-bottom: 0.6rem; color: #111827; }
                .blog-content-area p { margin-bottom: 1.2rem; }
                .blog-content-area ul, .blog-content-area ol { padding-left: 1.4rem; margin-bottom: 1.2rem; }
                .blog-content-area li { margin-bottom: 0.4rem; }

                .related-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #F3F4F6; transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; display: block; }
                .related-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
                .related-card-img { width: 100%; height: 160px; object-fit: cover; }
                .related-card-body { padding: 14px 16px 18px; }
                .related-card-title { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 0.95rem; color: #111827; line-height: 1.4; margin: 0; }

                .nav-link-custom { transition: color 0.3s ease; color: #555; }
                .nav-link-custom:hover { color: #FFB76C !important; }

                .social-link { transition: all 0.3s ease; color: #000; }
                .social-link:hover { transform: translateX(5px); color: #ffffff !important; }

                .category-badge { background-color: #FFB76C; color: #fff; font-size: 0.75rem; font-weight: 600; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 0; font-family: 'Inter', sans-serif; letter-spacing: 0.02em; }
                
                /* CSS Navbar Mobile */
                @media (max-width: 991px) {
                  .nav-actions-mobile {
                    position: absolute;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: #fff;
                    padding: 20px;
                    flex-direction: column;
                    align-items: flex-start !important;
                    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
                    display: flex !important;
                  }
                }
            `}</style>

            {/* ✅ NAVBAR DIPERBARUI SESUAI HOME */}
            <nav className="navbar py-3 fixed-top shadow-sm" style={{ backgroundColor: '#fff', zIndex: 999 }}>
              <div className="container-fluid px-4 px-lg-5 d-flex align-items-center">
                <Link className="navbar-brand brand-text fw-bold fs-3" style={{ color: '#111', letterSpacing: '-0.5px' }} to="/">
                  Ampatheia<span style={{ color: '#FFB76C' }}>.</span>
                </Link>
                
                <button className="d-lg-none ms-auto" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#111' }}>
                  {isMobileMenuOpen ? '✕' : '☰'}
                </button>

                <div className={`align-items-center gap-4 ms-lg-auto d-lg-flex ${isMobileMenuOpen ? 'nav-actions-mobile' : 'd-none'}`}>
                  <Link className="text-decoration-none fs-6 fw-medium text-dark nav-link-custom" to="/" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
                  <Link className="text-decoration-none fs-6 fw-medium text-dark nav-link-custom" to="/tour-packages" onClick={() => setIsMobileMenuOpen(false)}>Paket Wisata</Link>
                  <Link className="text-decoration-none fs-6 fw-medium text-dark nav-link-custom" to="/destinations" onClick={() => setIsMobileMenuOpen(false)}>Destinasi</Link>
                  <Link className="text-decoration-none fs-6 fw-medium text-dark nav-link-custom" to="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
                  
                  {user ? (
                    <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                      <Link to="/profile" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="d-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border">
                          <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Halo, <span style={{ color: '#FFB76C' }}>{user.name?.split(' ')[0] || "User"}</span></span>
                          <img src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=FFB76C&color=000&bold=true`} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        </div>
                      </Link>
                      <button onClick={handleLogout} className="btn btn-sm btn-outline-danger rounded-pill px-3">Keluar</button>
                    </div>
                  ) : (
                    <Link className="btn btn-sm btn-dark rounded-pill px-4 mt-3 mt-lg-0" to="/login" onClick={() => setIsMobileMenuOpen(false)}>Masuk</Link>
                  )}
                </div>
              </div>
            </nav>

            {/* MAIN KONTEN */}
            <div className="flex-grow-1" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
                <div className="container" style={{ maxWidth: '800px' }}>

                    {/* GAMBAR HERO */}
                    <div style={{ position: 'relative', marginBottom: '32px', borderRadius: '16px', overflow: 'hidden' }}>
                        {category && (
                            <span className="category-badge" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}>
                                {category}
                            </span>
                        )}
                        <img
                            src={coverImage}
                            alt={title}
                            style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    {/* CARD KONTEN ARTIKEL */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '40px 48px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>

                        {/* JUDUL */}
                        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '1.75rem', color: '#111827', marginBottom: '16px', lineHeight: '1.35' }}>
                            {title}
                        </h1>

                        {/* INFO PENULIS & TANGGAL */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#6B7280', fontSize: '0.875rem', paddingBottom: '20px', borderBottom: '1px solid #E5E7EB', marginBottom: '28px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaUser size={13} />
                                {author}
                            </span>
                            {publishedAt && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FaCalendarAlt size={13} />
                                    {formatDate(publishedAt)}
                                </span>
                            )}
                        </div>

                        {/* ISI ARTIKEL */}
                        <div
                            className="blog-content-area"
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {content}
                        </div>

                    </div>

                    {/* RELATED ARTICLES */}
                    {relatedBlogs.length > 0 && (
                        <div style={{ marginTop: '56px' }}>
                            <h4 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '1.25rem', color: '#111827', marginBottom: '20px' }}>
                                Related Articles
                            </h4>
                            <div className="row g-3">
                                {relatedBlogs.map((related) => (
                                    <div className="col-md-4" key={related.id}>
                                        <Link to={`/blog/${related.id}`} className="related-card">
                                            <img
                                                src={related.image_url || related.image || coverImage}
                                                alt={related.title}
                                                className="related-card-img"
                                            />
                                            <div className="related-card-body">
                                                <p className="related-card-title">{related.title}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* FOOTER */}
            <div style={{ position: 'relative', marginTop: '50px', width: '100%', overflow: 'hidden' }}>
                {/* SVG OMBAK */}
                <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto', marginBottom: '-1px' }}>
                    <path fill="#70E6D6" d="M0,32L48,48C96,64,192,96,288,101.3C384,107,480,85,576,64C672,43,768,21,864,21.3C960,21,1056,43,1152,58.7C1248,75,1344,85,1392,90.7L1440,96L1440,121L0,121Z" />
                </svg>

                <footer className="pt-0 pb-2" style={{ backgroundColor: '#70E6D6' }}>
                    <div className="container py-3">
                        <div className="row g-3 text-center justify-content-center">

                            {/* Kolom 1: Ampatheia */}
                            <div className="col-lg-4 px-lg-3">
                                <h4 className="fw-bold mb-2 text-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Ampatheia</h4>
                                <p className="text-dark fw-medium mb-0" style={{ lineHeight: '1.7', fontSize: '0.9rem' }}>
                                    Ampatheia hadir untuk memudahkan perjalanan wisata Anda ke Raja Ampat.
                                    Temukan paket wisata lengkap, itinerary terstruktur, dan pemandu lokal
                                    terpercaya dalam satu platform.
                                </p>
                            </div>

                            {/* Kolom 2: Tautan */}
                            <div className="col-lg-2 px-lg-3">
                                <h6 className="fw-bold mb-2 text-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Tautan</h6>
                                <ul className="list-unstyled text-dark fw-medium mb-0" style={{ lineHeight: '2', fontSize: '0.9rem' }}>
                                    <li><Link to="/" className="text-dark text-decoration-none nav-link-custom">Beranda</Link></li>
                                    <li><Link to="/tour-packages" className="text-dark text-decoration-none nav-link-custom">Paket Wisata</Link></li>
                                    <li><Link to="/blog" className="text-dark text-decoration-none nav-link-custom">Blog</Link></li>
                                </ul>
                            </div>

                            {/* Kolom 3: Hubungi Kami */}
                            <div className="col-lg-3 px-lg-3">
                                <h6 className="fw-bold mb-2 text-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Hubungi Kami</h6>
                                <ul className="list-unstyled text-dark fw-medium mb-0" style={{ lineHeight: '1.8', fontSize: '0.9rem' }}>
                                    <li>Email: info@ampatheia.com</li>
                                    <li>Telepon: +62 812-3456-7890</li>
                                    <li>Alamat: Jakarta, Indonesia</li>
                                </ul>
                            </div>

                            {/* Kolom 4: Ikuti Kami */}
                            <div className="col-lg-3 px-lg-3">
                                <h6 className="fw-bold mb-2 text-dark" style={{ fontFamily: 'Poppins, sans-serif' }}>Ikuti Kami</h6>
                                <div className="d-flex flex-column align-items-center fw-medium mt-2" style={{ gap: '12px', fontSize: '0.9rem' }}>
                                    <a href="https://instagram.com/ampatheia.id" target="_blank" rel="noopener noreferrer" className="social-link text-decoration-none d-flex align-items-center gap-2">
                                        <FaInstagram size={22} /><span>ampatheia.id</span>
                                    </a>
                                    <a href="https://facebook.com/ampatheia.id" target="_blank" rel="noopener noreferrer" className="social-link text-decoration-none d-flex align-items-center gap-2">
                                        <FaFacebook size={22} /><span>ampatheia.id</span>
                                    </a>
                                    <a href="https://ampatheia.id" target="_blank" rel="noopener noreferrer" className="social-link text-decoration-none d-flex align-items-center gap-2">
                                        <FaGlobe size={22} /><span>ampatheia.id</span>
                                    </a>
                                </div>
                            </div>

                        </div>

                        <div className="text-center pt-2 mt-2">
                            <span className="text-dark fw-medium" style={{ fontSize: '0.85rem' }}>
                                Copyright © 2026 Ampatheia. Hak cipta dilindungi
                            </span>
                        </div>
                    </div>
                </footer>
            </div>

        </div>
    );
}