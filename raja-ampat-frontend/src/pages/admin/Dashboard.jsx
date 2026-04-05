import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from '../../components/admin/Sidebar'; // <-- Import Sidebar yang baru

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
      let countBlogs = 0; // Siapkan variabel untuk menghitung blog

      // 1. Ambil Data Paket Tour
      try {
        const resPackages = await axios.get('http://localhost:5000/api/tour_packages', config);
        const dataPkg = resPackages.data;
        if (Array.isArray(dataPkg)) {
          countPackages = dataPkg.length;
        } else if (dataPkg && Array.isArray(dataPkg.data)) {
          countPackages = dataPkg.data.length;
        }
      } catch (error) {
        console.log("Belum bisa ambil paket tour:", error.message);
      }

      // 2. Ambil Data Artikel Blog
      try {
        const resBlogs = await axios.get('http://localhost:5000/api/blogs', config);
        const dataBlog = resBlogs.data;
        if (Array.isArray(dataBlog)) {
          countBlogs = dataBlog.length;
        } else if (dataBlog && Array.isArray(dataBlog.data)) {
          countBlogs = dataBlog.data.length;
        }
      } catch (error) {
        console.log("Belum bisa ambil artikel blog:", error.message);
      }

      // Update State dengan angka yang berhasil didapat
      setStats({
        bookings: 0,             // Belum ada API (Segera kita buat!)
        packages: countPackages, // Data paket tour
        inbox: 0,                // Belum ada API
        blogs: countBlogs,       // Data blog yang baru saja ditambahkan!
        gallery: 0               // Belum ada API
      });

      setIsLoading(false);
    };

    fetchDashboardData();
  }, [navigate]);

  const theme = { bgApp: '#f5f5f9', primary: '#696cff', primaryLight: '#e7e7ff', textMain: '#566a7f', textMuted: '#a1acb8', cardShadow: '0 2px 6px 0 rgba(67, 89, 113, 0.12)' };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap');
          body { background-color: ${theme.bgApp}; font-family: 'Public Sans', sans-serif; color: ${theme.textMain}; }
          .sneat-main { margin-left: 260px; padding: 20px; min-height: 100vh; }
          .sneat-navbar { background: white; border-radius: 8px; box-shadow: ${theme.cardShadow}; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
          .sneat-card { background: white; border-radius: 8px; border: none; box-shadow: ${theme.cardShadow}; transition: transform 0.2s; }
          .sneat-card:hover { transform: translateY(-3px); }
        `}
      </style>

      <div>
        {/* Panggil komponen Sidebar yang sudah dipisah, kode jadi jauh lebih bersih! */}
        <Sidebar />

        {/* KONTEN UTAMA */}
        <main className="sneat-main">
          <nav className="sneat-navbar">
            <div className="d-flex align-items-center w-50">
              <i className="bi bi-search me-2 text-muted"></i>
              <input type="text" className="form-control border-0 shadow-none bg-transparent" placeholder="Search data..." />
            </div>
            <div className="d-flex align-items-center">
              <span className="me-3 fw-bold">{adminName}</span>
              <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-person"></i>
              </div>
            </div>
          </nav>

          {isLoading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Menyinkronkan dengan Database...</p>
            </div>
          ) : (
            <>
              <div className="card sneat-card mb-4 p-4 position-relative overflow-hidden" style={{ background: `linear-gradient(to right, white, ${theme.primaryLight})` }}>
                <div className="row">
                  <div className="col-md-8">
                    <h4 className="fw-bold" style={{ color: theme.primary }}>Sistem Terhubung! 🚀</h4>
                    <p className="mb-0 mt-2">Dashboard Anda kini terhubung langsung dengan <strong>PostgreSQL Database</strong>.</p>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Bookings */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card sneat-card h-100 p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div><span className="d-block mb-1 fw-semibold text-muted">Total Bookings</span><h3 className="card-title mb-0">{stats.bookings}</h3></div>
                      <div className="rounded p-2" style={{ backgroundColor: 'rgba(113, 221, 55, 0.16)', color: '#71dd37' }}><i className="bi bi-calendar-check fs-4"></i></div>
                    </div>
                  </div>
                </div>

                {/* Packages */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card sneat-card h-100 p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div><span className="d-block mb-1 fw-semibold text-muted">Paket Tour</span><h3 className="card-title mb-0">{stats.packages}</h3></div>
                      <div className="rounded p-2" style={{ backgroundColor: 'rgba(105, 108, 255, 0.16)', color: theme.primary }}><i className="bi bi-map fs-4"></i></div>
                    </div>
                  </div>
                </div>

                {/* Blog */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card sneat-card h-100 p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div><span className="d-block mb-1 fw-semibold text-muted">Artikel Blog</span><h3 className="card-title mb-0">{stats.blogs}</h3></div>
                      <div className="rounded p-2" style={{ backgroundColor: 'rgba(3, 195, 236, 0.16)', color: '#03c3ec' }}><i className="bi bi-journal-text fs-4"></i></div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card sneat-card h-100 p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div><span className="d-block mb-1 fw-semibold text-muted">Foto Galeri</span><h3 className="card-title mb-0">{stats.gallery}</h3></div>
                      <div className="rounded p-2" style={{ backgroundColor: 'rgba(255, 171, 0, 0.16)', color: '#ffab00' }}><i className="bi bi-images fs-4"></i></div>
                    </div>
                  </div>
                </div>

                {/* Inbox Messages */}
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="card sneat-card h-100 p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div><span className="d-block mb-1 fw-semibold text-muted">Pesan Masuk</span><h3 className="card-title mb-0">{stats.inbox}</h3></div>
                      <div className="rounded p-2" style={{ backgroundColor: 'rgba(255, 62, 29, 0.16)', color: '#ff3e1d' }}><i className="bi bi-envelope fs-4"></i></div>
                    </div>
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