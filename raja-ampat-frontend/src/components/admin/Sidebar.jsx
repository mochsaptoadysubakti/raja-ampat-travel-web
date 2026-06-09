import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi untuk mengecek apakah URL saat ini sama dengan link menu (untuk warna active)
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <>
      <style>
        {`
          /* Custom Scrollbar */
          .sneat-sidebar::-webkit-scrollbar { width: 6px; }
          .sneat-sidebar::-webkit-scrollbar-track { background: transparent; }
          .sneat-sidebar::-webkit-scrollbar-thumb { background: #d9dee3; border-radius: 10px; }

          .sneat-sidebar { 
            width: 260px; 
            height: 100vh; 
            background: #f4f5fa; /* Tema Terang dengan sentuhan ungu/biru lembut sesuai gambar */
            position: fixed; 
            top: 0; 
            left: 0; 
            box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.05); 
            z-index: 1000; 
            overflow-y: auto; 
            transition: all 0.3s ease;
            font-family: 'Public Sans', sans-serif;
          }
          
          .nav-item-custom { 
            padding: 10px 16px; 
            margin: 4px 16px; 
            border-radius: 8px; 
            color: #697a8d; /* Warna teks abu-abu */
            text-decoration: none; 
            display: flex; 
            align-items: center; 
            font-weight: 500; 
            font-size: 0.95rem;
            transition: all 0.3s ease; 
          }
          
          .nav-item-custom i {
            font-size: 1.25rem;
            margin-right: 12px;
          }
          
          .nav-item-custom:hover { 
            background-color: rgba(67, 89, 113, 0.04); 
            color: #697a8d; 
          }
          
          .nav-item-custom.active { 
            background-color: #e7e7ff; /* Background biru muda cerah untuk menu aktif */
            color: #696cff; /* Teks ungu/biru untuk menu aktif */
            font-weight: 600;
          }

          .nav-header {
            padding: 12px 20px;
            margin-top: 12px;
            font-size: 0.75rem;
            text-transform: uppercase;
            font-weight: 600;
            color: #8c9baf; /* Abu-abu untuk header kategori */
          }

          .logout-btn {
            color: #ff3e1d !important; /* Warna merah */
          }
          
          .logout-btn:hover {
            background-color: rgba(255, 62, 29, 0.1) !important;
          }
        `}
      </style>

      <aside className="sneat-sidebar d-flex flex-column py-3">
        {/* --- BRAND LOGO --- */}
        <div className="px-4 mb-3 mt-2 d-flex align-items-center">
          <span style={{ fontSize: '1.8rem', color: '#5b61d6', marginRight: '8px' }}>
            <i className="bi bi-bezier2"></i>
          </span>
          {/* Warna teks Ampatheia disesuaikan menjadi keunguan */}
          <h4 className="fw-bold m-0" style={{ color: '#5b61d6', letterSpacing: '-0.5px', fontSize: '1.4rem' }}>Ampatheia</h4>
        </div>

        {/* --- PUSAT KENDALI --- */}
        <div className="nav-header">Pusat Kendali</div>
        
        <Link to="/admin/dashboard" className={`nav-item-custom ${isActive('/admin/dashboard')}`}>
          <i className="bi bi-speedometer2"></i> Dashboard
        </Link>
        <Link to="/admin/bookings" className={`nav-item-custom ${isActive('/admin/bookings')}`}>
          <i className="bi bi-calendar-check"></i> Manage Booking
        </Link>
        <Link to="/admin/packages" className={`nav-item-custom ${isActive('/admin/packages')}`}>
          <i className="bi bi-map"></i> Tour Packages
        </Link>
        <Link to="/admin/destinations" className={`nav-item-custom ${isActive('/admin/destinations')}`}>
          <i className="bi bi-geo-alt"></i> Manage Destinations
        </Link>

        {/* --- KONTEN & MEDIA --- */}
        <div className="nav-header">Konten & Media</div>
        
        <Link to="/admin/blog" className={`nav-item-custom ${isActive('/admin/blog')}`}>
          <i className="bi bi-journal-text"></i> Manage Blog
        </Link>
        <Link to="/admin/gallery" className={`nav-item-custom ${isActive('/admin/gallery')}`}>
          <i className="bi bi-images"></i> Manage Gallery
        </Link>

        {/* --- KOMUNIKASI & SISTEM --- */}
        <div className="nav-header">Komunikasi & Sistem</div>
        
        <Link to="/admin/inbox" className={`nav-item-custom ${isActive('/admin/inbox')}`}>
          <i className="bi bi-envelope"></i> Contact Inbox
        </Link>
        <Link to="/admin/reviews" className={`nav-item-custom ${isActive('/admin/reviews')}`}>
          <i className="bi bi-star"></i> Manage Reviews
        </Link>
        <Link to="/admin/users" className={`nav-item-custom ${isActive('/admin/users')}`}>
          <i className="bi bi-people"></i> Manajemen User
        </Link>
        
        {/* --- TOMBOL LOGOUT --- */}
        <div className="mt-auto pt-4 pb-3">
          <button 
            onClick={handleLogout} 
            className="nav-item-custom logout-btn border-0 bg-transparent text-start w-100" 
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;