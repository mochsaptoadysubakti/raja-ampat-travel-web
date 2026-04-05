import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import halaman Admin
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard'; 
import ManagePackages from './pages/admin/ManagePackages'; 
import ManageBookings from './pages/admin/ManageBookings';
import ManageBlog from './pages/admin/ManageBlog';
import ManageDestinations from './pages/admin/ManageDestinations'; 
import ManageReviews from './pages/admin/ManageReviews';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute untuk halaman Login Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Rute untuk halaman Pusat Kendali */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />
        <Route path="/admin/packages" element={<ManagePackages />} />
        <Route path="/admin/destinations" element={<ManageDestinations />} />
        <Route path="/admin/blog" element={<ManageBlog />} />
        <Route path="/admin/reviews" element={<ManageReviews />} />
        {/* Rute yang belum dibuat (bisa ditambahkan nanti) */}
        {/* <Route path="/admin/gallery" element={<ManageGallery />} /> */}
        {/* <Route path="/admin/inbox" element={<ContactInbox />} /> */}
        {/* <Route path="/admin/users" element={<ManageUsers />} /> */}
      </Routes>
    </Router>
  );
}

export default App;