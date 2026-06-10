import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from '../../components/admin/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  
  const [stats, setStats] = useState({
    bookings: 0,
    packages: 0,
    inbox: 0,
    blogs: 0,
    gallery: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE PENCARIAN ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- STATE UNTUK DATA ASLI DARI DATABASE ---
  const [realMessages, setRealMessages] = useState([]);
  const [realBookings, setRealBookings] = useState([]);
  const [realDestinations, setRealDestinations] = useState([]);

  // Array warna untuk grafik destinasi secara dinamis
  const chartColors = ['#1A237E', '#00E5FF', '#5C6BC0', '#B2EBF2', '#2962FF'];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Anda belum login!');
      navigate('/admin/login');
      return;
    }

    const fetchDashboardData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let countPackages = 0;
      let countBlogs = 0; 
      let countBookings = 0;
      let countGallery = 0; 
      let countInbox = 0; 

      // 1. Ambil Data Paket Tour Asli
      try {
        const resPackages = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tour_packages`, config);
        const dataPkg = resPackages.data?.data || resPackages.data || [];
        if (Array.isArray(dataPkg)) countPackages = dataPkg.length;
      } catch (error) { console.log("Gagal ambil paket:", error.message); }

      // 2. Ambil Data Artikel Blog Asli
      try {
        const resBlogs = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/blogs`, config);
        const dataBlog = resBlogs.data?.data || resBlogs.data || [];
        if (Array.isArray(dataBlog)) countBlogs = dataBlog.length;
      } catch (error) { console.log("Gagal ambil blog:", error.message); }

      // 3. Ambil Data Bookings Asli (Tabel Recent Bookings)
      try {
        const resBookings = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, config);
        const dataBooking = resBookings.data?.data || resBookings.data || [];
        if (Array.isArray(dataBooking)) {
          countBookings = dataBooking.length;
          const sortedBookings = [...dataBooking].reverse().slice(0, 5);
          setRealBookings(sortedBookings);
        }
      } catch (error) { console.log("Gagal ambil bookings:", error.message); }

      // 4. Ambil Data Galeri Asli
      try {
        const resGallery = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery`, config);
        const dataGal = resGallery.data?.data || resGallery.data || [];
        if (Array.isArray(dataGal)) countGallery = dataGal.length;
      } catch (error) { console.log("Gagal ambil galeri:", error.message); }

      // 5. Ambil Data Pesan Masuk Asli (Inbox Section)
      try {
        const resInbox = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contacts`, config);
        const dataInb = resInbox.data?.data || resInbox.data || [];
        if (Array.isArray(dataInb)) {
          countInbox = dataInb.length;
          const sortedMessages = [...dataInb].reverse().slice(0, 3);
          setRealMessages(sortedMessages);
        }
      } catch (error) { console.log("Gagal ambil pesan:", error.message); }

      // 6. Ambil Data Destinasi Asli
      try {
        const resDest = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/destinations`, config);
        const dataDest = resDest.data?.data || resDest.data || [];
        if (Array.isArray(dataDest)) {
          setRealDestinations(dataDest.slice(0, 5));
        }
      } catch (error) { console.log("Gagal ambil destinasi:", error.message); }

      // Update Angka Statistik Atas
      setStats({
        bookings: countBookings,
        packages: countPackages, 
        inbox: countInbox,      
        blogs: countBlogs,      
        gallery: countGallery    
      });

      setIsLoading(false);
    };

    fetchDashboardData();
  }, [navigate]);

  // --- LOGIKA FILTER PENCARIAN REAL-TIME ---
  const query = searchQuery.toLowerCase();

  const filteredMessages = realMessages.filter(msg => 
    (msg.name || '').toLowerCase().includes(query) || 
    (msg.email || '').toLowerCase().includes(query) ||
    (msg.message || msg.pesan || '').toLowerCase().includes(query)
  );

  const filteredDestinations = realDestinations.filter(dest => 
    (dest.name || '').toLowerCase().includes(query) ||
    (dest.category || '').toLowerCase().includes(query)
  );

  const filteredBookings = realBookings.filter(book => 
    (book.name || book.user_name || '').toLowerCase().includes(query) ||
    (book.status || '').toLowerCase().includes(query) ||
    (book.phone || book.no_hp || '').toLowerCase().includes(query)
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap');
          body { background-color: #f8f9fa; font-family: 'Public Sans', sans-serif; color: #566a7f; }
          .sneat-main { margin-left: 260px; padding: 24px; min-height: 100vh; }
          .sneat-navbar { background: white; border-radius: 12px; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border: 1px solid #eee; }
          .sneat-card { background: white; border-radius: 16px; border: 1px solid #f0f0f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: transform 0.2s; overflow: hidden; }
          
          .welcome-text { color: #1E3A8A; font-weight: 700; font-size: 1.25rem; }
          .section-title { font-weight: 700; color: #111; margin: 24px 0 16px 0; font-size: 1.1rem; }
          
          .stat-icon { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 1.3rem; }
          .stat-value { font-size: 1.8rem; font-weight: 700; color: #111; margin-top: 10px; }
          
          /* Message List Styling */
          .msg-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
          .msg-item:last-child { border-bottom: none; }
          .msg-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
          .msg-badge { background-color: #0d6efd; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
          
          /* Chart Styling */
          .donut-chart {
            width: 130px; height: 130px; border-radius: 50%;
            position: relative;
            margin: 0 auto;
          }
          .donut-inner {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 85px; height: 85px; background: white; border-radius: 50%;
          }
          .legend-dot { width: 12px; height: 12px; border-radius: 4px; display: inline-block; margin-right: 10px; }

          /* Table Styling */
          .table-custom th { background-color: #E0F7FA !important; color: #00838F; font-weight: 600; font-size: 0.85rem; padding: 12px 16px; border: none; }
          .table-custom td { padding: 12px 16px; vertical-align: middle; font-size: 0.85rem; color: #555; border-bottom: 1px solid #f0f0f0; }
          
          .badge-status { padding: 5px 12px; border-radius: 20px; font-weight: 600; font-size: 0.75rem; }
          .badge-pending { background-color: #FFF3E0; color: #E65100; }
          .badge-paid { background-color: #E8F5E9; color: #2E7D32; }
        `}
      </style>

      <div>
        <Sidebar />

        <main className="sneat-main">
          {/* --- NAVBAR TOP (SEARCH BAR BERFUNGSI) --- */}
          <nav className="sneat-navbar">
            <div className="d-flex align-items-center w-50">
              <i className="bi bi-search me-3 fs-5 text-muted"></i>
              <input 
                type="text" 
                className="form-control border-0 shadow-none bg-transparent" 
                placeholder="Cari pelanggan, pesan, atau destinasi..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="fw-semibold text-dark">{adminName}</span>
              <img src="https://ui-avatars.com/api/?name=Admin&background=f0f0f0&color=333" alt="Admin" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
            </div>
          </nav>

          {isLoading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Sinkronisasi Database PostgreSQL...</p>
            </div>
          ) : (
            <>
              {/* --- WELCOME CARD --- */}
              <div className="card sneat-card p-4 mb-2">
                <h4 className="welcome-text mb-2">Welcome Back, {adminName}</h4>
                <p className="text-primary mb-0 fw-medium">Sistem Pusat Kendali Admin Panel Terhubung Langsung ke Database Server.</p>
              </div>

              <h5 className="section-title">Overview Ringkasan</h5>

              {/* --- STATS ROW (4 CARDS UTAMA) --- */}
              <div className="row g-4 mb-4">
                <div className="col-lg-3 col-md-6">
                  <div className="card sneat-card p-4 h-100">
                    <div className="d-flex justify-content-between">
                      <div>
                        <span className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>Total Bookings</span>
                        <div className="stat-value">{stats.bookings}</div>
                      </div>
                      <div className="stat-icon" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                        <i className="bi bi-calendar-check"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card sneat-card p-4 h-100">
                    <div className="d-flex justify-content-between">
                      <div>
                        <span className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>Paket Wisata</span>
                        <div className="stat-value">{stats.packages}</div>
                      </div>
                      <div className="stat-icon" style={{ backgroundColor: '#E8EAF6', color: '#3F51B5' }}>
                        <i className="bi bi-map"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card sneat-card p-4 h-100">
                    <div className="d-flex justify-content-between">
                      <div>
                        <span className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>Artikel Blog</span>
                        <div className="stat-value">{stats.blogs}</div>
                      </div>
                      <div className="stat-icon" style={{ backgroundColor: '#E0F7FA', color: '#00BCD4' }}>
                        <i className="bi bi-file-earmark-text"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card sneat-card p-4 h-100">
                    <div className="d-flex justify-content-between">
                      <div>
                        <span className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>Foto Galeri</span>
                        <div className="stat-value">{stats.gallery}</div>
                      </div>
                      <div className="stat-icon" style={{ backgroundColor: '#FFF3E0', color: '#FF9800' }}>
                        <i className="bi bi-images"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- BOTTOM SECTION --- */}
              <div className="row g-4">
                
                {/* 1. DATA FILTER: Pesan Masuk */}
                <div className="col-lg-4 col-md-12">
                  <div className="card sneat-card p-4 h-100" style={{ backgroundColor: '#fff' }}>
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                      <div>
                        <span className="text-muted fw-semibold d-block" style={{ fontSize: '0.9rem' }}>Pesan Masuk (Kontak)</span>
                        <span className="fw-bold text-dark fs-4">{filteredMessages.length} Pesan</span>
                      </div>
                      <div className="stat-icon" style={{ backgroundColor: '#FFEBEE', color: '#D32F2F' }}>
                        <i className="bi bi-envelope"></i>
                      </div>
                    </div>
                    
                    <div className="message-list">
                      {filteredMessages.length > 0 ? filteredMessages.map((msg, index) => (
                        <div className="msg-item" key={msg.id || index}>
                          <img src={`https://ui-avatars.com/api/?name=${msg.name || 'User'}&background=random`} alt="Avatar" className="msg-avatar" />
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                              {msg.name} 
                            </h6>
                            <p className="mb-0 text-muted text-truncate" style={{ fontSize: '0.75rem', maxWidth: '180px' }}>
                              {msg.message || msg.pesan || "Tidak ada isi pesan..."}
                            </p>
                          </div>
                          <div className="text-end">
                            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>{msg.email?.split('@')[0] || "User"}</small>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-4 text-muted small">Pesan tidak ditemukan.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. DATA FILTER: Top Destination */}
                <div className="col-lg-4 col-md-12">
                  <div className="card sneat-card p-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold text-dark mb-0">Destinasi Terdaftar</h6>
                      <span className="badge bg-light text-primary border px-2 py-1" style={{ fontSize: '0.75rem' }}>Live Database</span>
                    </div>

                    <div className="d-flex flex-column justify-content-center h-100">
                      {/* Logika Donut Chart Dinamis Mengikuti Filter */}
                      {(() => {
                        let currentPercentage = 0;
                        const gradientStops = filteredDestinations.map((dest, i) => {
                          const portion = 100 / (filteredDestinations.length || 1); 
                          const start = currentPercentage;
                          const end = currentPercentage + portion;
                          currentPercentage = end;
                          return `${chartColors[i % chartColors.length]} ${start}% ${end}%`;
                        }).join(', ');

                        return (
                          <div 
                            className="donut-chart mb-4 flex-shrink-0" 
                            style={{ background: filteredDestinations.length > 0 ? `conic-gradient(${gradientStops})` : '#e0e0e0' }}
                          >
                            <div className="donut-inner"></div>
                          </div>
                        );
                      })()}

                      <div className="w-100 px-2">
                        {filteredDestinations.length > 0 ? filteredDestinations.map((dest, i) => (
                          <div className="d-flex align-items-center mb-2 justify-content-between" key={dest.id || i}>
                            <div className="d-flex align-items-center">
                              <div className="legend-dot" style={{ backgroundColor: chartColors[i % chartColors.length] }}></div>
                              <span className="fw-semibold text-dark text-capitalize" style={{ fontSize: '0.85rem' }}>{dest.name}</span>
                            </div>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{dest.category || 'Spot Alam'}</small>
                          </div>
                        )) : (
                          <div className="text-center text-muted small">Destinasi tidak ditemukan.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. DATA FILTER: Recent Booking Table */}
                <div className="col-lg-4 col-md-12">
                  <div className="card sneat-card p-0 h-100 overflow-auto">
                    <div className="p-4 pb-2">
                      <h6 className="fw-bold text-dark mb-0">Recent Booking</h6>
                    </div>
                    <table className="table table-custom mb-0">
                      <thead>
                        <tr>
                          <th>Pelanggan</th>
                          <th>Tanggal</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.length > 0 ? filteredBookings.map((book, index) => (
                          <tr key={book.id || index}>
                            <td className="fw-bold text-dark">
                              {book.name || book.user_name || "Pelanggan"}
                              <small className="d-block text-muted fw-normal" style={{ fontSize: '0.7rem' }}>{book.phone || book.no_hp || "-"}</small>
                            </td>
                            <td>{book.date || book.booking_date || "-"}</td>
                            <td className="fw-semibold text-dark">
                              Rp {Number(book.total_price || book.total_amount || 0).toLocaleString('id-ID')}
                            </td>
                            <td>
                              <span className={`badge-status ${
                                (book.status || '').toLowerCase().includes('lunas') || (book.status || '').toLowerCase().includes('paid') 
                                  ? 'badge-paid' 
                                  : 'badge-pending'
                              }`}>
                                {book.status || "Pending"}
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" className="text-center py-4 text-muted">Booking tidak ditemukan.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;