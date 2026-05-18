import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import halaman Utama (Public)
import Home from './pages/Home';
import Register from './pages/Register'; 
import Login from './pages/Login';
import TourPackages from './pages/TourPackages'; 
import TourDetail from './pages/TourDetail'; // <-- TAMBAHAN: Import halaman Detail Paket Tour

// Import halaman Admin
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard'; 
import ManagePackages from './pages/admin/ManagePackages'; 
import ManageBookings from './pages/admin/ManageBookings';
import ManageBlog from './pages/admin/ManageBlog';
import ManageDestinations from './pages/admin/ManageDestinations'; 
import ManageReviews from './pages/admin/ManageReviews';
import ContactInbox from './pages/admin/ContactInbox';
import ManageGallery from './pages/admin/ManageGallery'; 
import ManageUsers from './pages/admin/ManageUsers'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute untuk halaman Utama (Public / Pengunjung) */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/tour-packages" element={<TourPackages />} /> 
        <Route path="/detail/:id" element={<TourDetail />} /> {/* <-- TAMBAHAN: Rute Detail Paket */}

        {/* Redirect otomatis untuk /admin agar tidak layar putih */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Rute untuk halaman Login Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Rute untuk halaman Pusat Kendali (Sneat Admin Panel) */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />
        <Route path="/admin/packages" element={<ManagePackages />} />
        <Route path="/admin/destinations" element={<ManageDestinations />} />
        
        {/* Rute Konten & Media */}
        <Route path="/admin/blog" element={<ManageBlog />} />
        <Route path="/admin/gallery" element={<ManageGallery />} />
        
        {/* Rute Komunikasi & Sistem */}
        <Route path="/admin/inbox" element={<ContactInbox />} />
        <Route path="/admin/reviews" element={<ManageReviews />} />
        
        {/* Rute Manajemen Pengguna - Baru Diaktifkan */}
        <Route path="/admin/users" element={<ManageUsers />} />

        {/* Rute tambahan di masa depan bisa ditaruh di bawah sini */}
      </Routes>
    </Router>
  );
}

export default App;