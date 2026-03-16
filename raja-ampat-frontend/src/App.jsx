import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        {/* Nanti Navbar kita taruh di sini */}
        
        <Routes>
          <Route path="/" element={<h1>Halaman Home (Beranda)</h1>} />
          <Route path="/destinations" element={<h1>Halaman Destinasi</h1>} />
          <Route path="/packages" element={<h1>Halaman Paket Tour</h1>} />
          <Route path="/packages/:id" element={<h1>Halaman Detail Paket</h1>} />
          <Route path="/booking" element={<h1>Halaman Booking</h1>} />
          <Route path="/gallery" element={<h1>Halaman Galeri</h1>} />
          <Route path="/blog" element={<h1>Halaman Blog</h1>} />
          <Route path="/contact" element={<h1>Halaman Kontak</h1>} />
        </Routes>

        {/* Nanti Footer kita taruh di sini */}
      </div>
    </Router>
  );
}

export default App;