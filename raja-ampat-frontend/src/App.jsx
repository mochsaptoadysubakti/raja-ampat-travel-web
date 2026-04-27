import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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