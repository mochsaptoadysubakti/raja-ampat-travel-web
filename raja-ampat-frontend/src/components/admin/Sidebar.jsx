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

  const theme = { primary: '#696cff', primaryLight: '#e7e7ff', textMain: '#566a7f', textMuted: '#a1acb8' };

  return (
    <>
      <style>
        {`
          .sneat-sidebar { width: 260px; height: 100vh; background: white; position: fixed; top: 0; left: 0; box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.4); z-index: 1000; overflow-y: auto; }
          .nav-item-custom { padding: 10px 15px; margin: 5px 15px; border-radius: 8px; color: ${theme.textMain}; text-decoration: none; display: flex; align-items: center; font-weight: 500; transition: all 0.3s ease; }
          .nav-item-custom:hover { background-color: rgba(67, 89, 113, 0.04); color: ${theme.primary}; }
          .nav-item-custom.active { background-color: ${theme.primaryLight}; color: ${theme.primary}; }
        `}
      </style>

      <aside className="sneat-sidebar d-flex flex-column py-3">
        <div className="px-4 mb-4 d-flex align-items-center">
          <span style={{ fontSize: '1.8rem', color: theme.primary, marginRight: '10px' }}>
            <i className="bi bi-bezier2"></i>
          </span>
          <h4 className="fw-bold m-0" style={{ color: '#566a7f', letterSpacing: '-0.5px' }}>Ampatheia</h4>
        </div>

        <div className="px-3 mb-2 small fw-bold text-uppercase" style={{ color: theme.textMuted, fontSize: '0.75rem' }}>Pusat Kendali</div>
        <Link to="/admin/dashboard" className={`nav-item-custom ${isActive('/admin/dashboard')}`}>
          <i className="bi bi-speedometer2 me-3 fs-5"></i> Dashboard
        </Link>
        <Link to="/admin/bookings" className={`nav-item-custom ${isActive('/admin/bookings')}`}>
          <i className="bi bi-calendar-check me-3 fs-5"></i> Manage Bookings
        </Link>
        <Link to="/admin/packages" className={`nav-item-custom ${isActive('/admin/packages')}`}>
          <i className="bi bi-map me-3 fs-5"></i> Tour Packages
        </Link>
        <Link to="/admin/destinations" className={`nav-item-custom ${isActive('/admin/destinations')}`}>
          <i className="bi bi-geo-alt me-3 fs-5"></i> Manage Destinations
        </Link>

        <div className="px-3 mt-4 mb-2 small fw-bold text-uppercase" style={{ color: theme.textMuted, fontSize: '0.75rem' }}>Konten & Media</div>
        <Link to="/admin/blog" className={`nav-item-custom ${isActive('/admin/blog')}`}>
          <i className="bi bi-journal-text me-3 fs-5"></i> Manage Blog
        </Link>
        <Link to="/admin/gallery" className={`nav-item-custom ${isActive('/admin/gallery')}`}>
          <i className="bi bi-images me-3 fs-5"></i> Manage Gallery
        </Link>

        <div className="px-3 mt-4 mb-2 small fw-bold text-uppercase" style={{ color: theme.textMuted, fontSize: '0.75rem' }}>Komunikasi & Sistem</div>
        <Link to="/admin/inbox" className={`nav-item-custom ${isActive('/admin/inbox')}`}>
          <i className="bi bi-envelope me-3 fs-5"></i> Contact Inbox
        </Link>
        
        {/* TAMBAHAN MENU BARU: MANAGE REVIEWS */}
        <Link to="/admin/reviews" className={`nav-item-custom ${isActive('/admin/reviews')}`}>
          <i className="bi bi-star me-3 fs-5"></i> Manage Reviews
        </Link>

        <Link to="/admin/users" className={`nav-item-custom ${isActive('/admin/users')}`}>
          <i className="bi bi-people me-3 fs-5"></i> Manajemen User
        </Link>
        
        <button onClick={handleLogout} className="nav-item-custom text-danger mt-auto border-0 bg-transparent text-start w-100" style={{ marginBottom: '20px' }}>
          <i className="bi bi-box-arrow-right me-3 fs-5"></i> Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;