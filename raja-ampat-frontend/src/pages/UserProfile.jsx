import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  // --- STATE USER & UI ---
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("akun"); // 'akun' atau 'riwayat'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutAnim, setShowLogoutAnim] = useState(false);
  
  // --- TAMBAHAN ANIMASI: State untuk animasi sukses ---
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  // --- STATE EDIT PROFIL ---
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE RIWAYAT PESANAN & MODAL ---
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); // State untuk Pop-up

  // Cek Sesi Login Saat Halaman Dimuat
  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem('userData');
    const token = localStorage.getItem('userToken');

    if (!storedUser || !token) {
      navigate('/login'); 
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Set nilai awal untuk form edit
      setEditName(parsedUser.name || "");
      setEditPhone(parsedUser.phone || parsedUser.no_hp || "");
      
      // Ambil data riwayat pesanan
      fetchBookingHistory(parsedUser.id, token);
    }
  }, [navigate]);

  // Fungsi Tarik Riwayat Pesanan
  const fetchBookingHistory = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataArray = response.data?.data || response.data || [];
      setBookings(Array.isArray(dataArray) ? dataArray : []);
    } catch (error) {
      console.error("Gagal memuat riwayat pesanan dari API", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // --- FUNGSI UPDATE PROFIL ---
  const handleUpdateProfile = async () => {
    if (!editName || !editPhone) {
        alert("Nama dan Nomor Handphone tidak boleh kosong!");
        return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('userToken');
      
      const payload = {
        name: editName,
        phone: editPhone,
        no_hp: editPhone,
        email: user.email 
      };

      await axios.put(`http://localhost:5000/api/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = { ...user, name: editName, phone: editPhone, no_hp: editPhone };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));

      // --- TAMBAHAN ANIMASI: Tampilkan animasi sukses alih-alih alert ---
      setShowSuccessAnim(true);
      
      // Sembunyikan animasi dan tutup mode edit setelah 2 detik
      setTimeout(() => {
        setShowSuccessAnim(false);
        setIsEditing(false);
      }, 2000);

    } catch (error) {
      console.error("Detail Error Update Profil:", error.response || error);
      const errorMsg = error.response?.data?.message 
                    || error.response?.data?.error 
                    || "Pastikan server backend berjalan dan rute PUT /api/users/:id tersedia.";
                    
      alert(`Gagal menyimpan: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi Logout
  const handleLogout = () => {
    setShowLogoutAnim(true);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setTimeout(() => {
      setShowLogoutAnim(false);
      navigate('/login');
    }, 2000); 
  };

  // Helper Fungsi Status Badge
  const getStatusDisplay = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('confirmed') || statusLower.includes('lunas') || statusLower.includes('success')) {
      return { class: 'status-lunas', label: 'Terkonfirmasi' };
    } else if (statusLower.includes('cancel') || statusLower.includes('batal')) {
      return { class: 'status-batal', label: 'Dibatalkan' };
    }
    return { class: 'status-pending', label: status || 'Menunggu Konfirmasi' };
  };

  if (!user) return null;

  return (
    <div style={{ backgroundColor: '#F4F7FE', minHeight: '100vh', paddingTop: '70px', paddingBottom: '80px' }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #F4F7FE; }
          h1, h2, h3, h4, h5, h6, .brand-text { font-family: 'Poppins', sans-serif; }

          /* NAVBAR CUSTOM */
          .nav-link-custom { transition: color 0.3s ease; color: #555; }
          .nav-link-custom:hover { color: #000 !important; }

          /* MODAL STYLING */
          .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); z-index: 1050; display: flex; justify-content: center; align-items: center; padding: 20px; animation: fadeIn 0.3s forwards;}
          .modal-content-small { background-color: #fff; border-radius: 20px; max-width: 400px; width: 100%; padding: 40px 20px; text-align: center; }
          .modal-content-large { background-color: #fff; border-radius: 24px; max-width: 500px; width: 100%; padding: 30px; text-align: left; box-shadow: 0 25px 50px rgba(0,0,0,0.15); animation: scaleUp 0.3s forwards; overflow-y: auto; max-height: 90vh; }
          
          .spinner-custom { width: 50px; height: 50px; border: 4px solid rgba(255, 183, 108, 0.3); border-top-color: #FFB76C; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto; }
          
          /* --- TAMBAHAN ANIMASI: CSS untuk Icon Sukses --- */
          .success-checkmark { width: 60px; height: 60px; border-radius: 50%; background-color: #10B981; color: white; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: bold; margin: 0 auto 20px auto; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }

          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }
          @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } } /* --- TAMBAHAN ANIMASI --- */

          /* SIDEBAR MENU PROFIL */
          .profile-sidebar { background: #fff; border-radius: 20px; padding: 30px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
          .profile-avatar-container { text-align: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 25px; margin-bottom: 20px; }
          .profile-avatar { width: 100px; height: 100px; border-radius: 50%; border: 4px solid #F4F7FE; box-shadow: 0 5px 15px rgba(255, 183, 108, 0.3); margin-bottom: 15px; }
          
          .profile-menu-item { display: flex; align-items: center; gap: 15px; padding: 14px 20px; border-radius: 12px; color: #64748B; font-weight: 600; text-decoration: none; transition: all 0.3s; cursor: pointer; margin-bottom: 8px; border: 1px solid transparent; }
          .profile-menu-item:hover { background-color: #F8F9FA; color: #111; }
          .profile-menu-item.active { background-color: #FFF5EC; color: #FFB76C; border-color: #FFE0C2; }
          .profile-menu-item.logout { color: #E53E3E; margin-top: 20px; }
          .profile-menu-item.logout:hover { background-color: #FFF5F5; }

          /* KONTEN UTAMA PROFIL */
          .profile-content-card { background: #fff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); min-height: 500px; }
          .section-title { font-weight: 700; color: #111; margin-bottom: 30px; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; }
          
          /* FORM STYLING */
          .form-label-custom { font-weight: 600; color: #475569; font-size: 0.9rem; margin-bottom: 8px; display: block; }
          .form-control-custom { background-color: #F8F9FA; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 18px; font-size: 0.95rem; color: #111; transition: all 0.3s; width: 100%; }
          .form-control-custom:read-only { background-color: #E2E8F0; color: #64748B; cursor: not-allowed; }
          .form-control-custom:not(:read-only) { background-color: #fff; border-color: #FFB76C; box-shadow: 0 0 0 3px rgba(255, 183, 108, 0.1); }

          .btn-primary-custom { background-color: #111; color: #fff; font-weight: 700; border-radius: 12px; padding: 14px 30px; border: none; transition: all 0.3s; width: 100%; }
          .btn-primary-custom:hover { background-color: #FFB76C; color: #111; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255, 183, 108, 0.3); }

          /* TOMBOL EDIT & SIMPAN */
          .btn-outline-custom { border: 1px solid #111; color: #111; font-weight: 600; border-radius: 8px; padding: 8px 16px; background: transparent; transition: all 0.3s; font-size: 0.9rem; }
          .btn-outline-custom:hover { background: #111; color: #fff; }
          .btn-save-custom { background-color: #111; color: #fff; font-weight: 600; border-radius: 8px; padding: 8px 24px; border: none; transition: all 0.3s; font-size: 0.9rem; }
          .btn-save-custom:hover { background-color: #FFB76C; color: #111; }

          /* TIKET RIWAYAT PESANAN */
          .history-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 25px; margin-bottom: 20px; transition: all 0.3s; cursor: pointer; }
          .history-card:hover { border-color: #FFB76C; box-shadow: 0 10px 25px rgba(255, 183, 108, 0.15); transform: translateY(-3px); }
          .status-badge { padding: 6px 16px; border-radius: 30px; font-weight: 700; font-size: 0.8rem; }
          .status-lunas { background-color: #D1FAE5; color: #22543D; }
          .status-pending { background-color: #FEF3C7; color: #92400E; }
          .status-batal { background-color: #FEE2E2; color: #991B1B; }

          .btn-close-custom { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; cursor: pointer; transition: 0.2s;}
          .btn-close-custom:hover { background: #e2e8f0; color: #e53e3e; }

          .btn-wa { background-color: #25D366; color: white; border: none; border-radius: 12px; padding: 12px; font-weight: 600; transition: all 0.3s; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;}
          .btn-wa:hover { background-color: #1ebc59; color: white; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3); }

          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .anim-fade-up { animation: fadeInUp 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }

          @media (max-width: 991px) {
            .profile-content-card { padding: 25px; margin-top: 20px; }
            .nav-actions-mobile { display: flex !important; flex-direction: column; position: absolute; top: 70px; left: 5vw; right: 5vw; background: #fff; padding: 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); text-align: center; gap: 15px !important; z-index: 1000; }
          }
        `}
      </style>

      {/* --- TAMBAHAN ANIMASI: POPUP SUKSES UPDATE PROFIL --- */}
      {showSuccessAnim && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content-small" style={{ animation: 'scaleUp 0.3s forwards' }}>
            <div className="success-checkmark">✓</div>
            <h4 className="fw-bold text-dark mb-2">Berhasil!</h4>
            <p className="text-secondary small mb-0">Profil Anda telah berhasil diperbarui.</p>
          </div>
        </div>
      )}

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

      {/* --- POPUP DETAIL PESANAN --- */}
      {selectedBooking && (
        <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={() => setSelectedBooking(null)}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0 text-dark">Detail Pemesanan</h4>
              <button className="btn-close-custom" onClick={() => setSelectedBooking(null)}>✕</button>
            </div>
            
            <div className="p-3 bg-light rounded-3 mb-4 border">
              <span className={`status-badge ${getStatusDisplay(selectedBooking.status).class} d-inline-block mb-2`}>
                Status: {getStatusDisplay(selectedBooking.status).label}
              </span>
              <div className="text-muted small">ID Transaksi: <strong>{selectedBooking.id || selectedBooking.booking_id || `TRX-${selectedBooking.id}`}</strong></div>
            </div>

            <h6 className="fw-bold text-secondary text-uppercase small mb-3">Data Diri Pemesan</h6>
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                <span className="text-muted">Nama Lengkap</span>
                <span className="fw-medium text-dark text-end">{user.name}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                <span className="text-muted">Email</span>
                <span className="fw-medium text-dark text-end">{user.email}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Telepon / WhatsApp</span>
                <span className="fw-medium text-dark text-end">{user.phone || user.no_hp || "-"}</span>
              </div>
            </div>

            <h6 className="fw-bold text-secondary text-uppercase small mb-3">Detail Paket</h6>
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                <span className="text-muted">Nama Paket</span>
                <span className="fw-medium text-dark text-end">{selectedBooking.tour_name || selectedBooking.title || "Paket Wisata"}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                <span className="text-muted">Tanggal Keberangkatan</span>
                <span className="fw-medium text-dark text-end">{selectedBooking.booking_date ? new Date(selectedBooking.booking_date).toLocaleDateString('id-ID') : "-"}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                <span className="text-muted">Jumlah Tamu</span>
                <span className="fw-medium text-dark text-end">{selectedBooking.total_people || 1} Orang</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total Harga</span>
                <span className="fw-bold fs-5 text-dark">Rp {Number(selectedBooking.total_price || 0).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted small mb-2">Butuh bantuan konfirmasi pembayaran atau kendala?</p>
              <a 
                href={`https://wa.me/6283189916740?text=Halo%20Admin%20Ampatheia,%20saya%20ingin%20bertanya%20terkait%20pesanan%20saya%20dengan%20ID:%20${selectedBooking.id || selectedBooking.booking_id}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-wa w-100"
              >
                <i className="bi bi-whatsapp"></i> Hubungi Admin (083189916740)
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="navbar py-3 fixed-top" style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', zIndex: 999 }}>
        <div className="container-fluid px-4 px-lg-5 d-flex align-items-center">
          <Link className="navbar-brand brand-text fs-3" style={{ color: '#111', letterSpacing: '-0.5px' }} to="/">
            Ampatheia<span style={{ color: '#FFB76C' }}>.</span>
          </Link>
          
          <button className="d-lg-none ms-auto" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', fontSize: '1.8rem', color: '#111' }}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>

          <div className={`align-items-center gap-4 ms-lg-auto d-lg-flex ${isMobileMenuOpen ? 'nav-actions-mobile' : 'd-none'}`}>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/tour-packages" onClick={() => setIsMobileMenuOpen(false)}>Paket Wisata</Link>
            <Link className="text-decoration-none fs-6 fw-medium nav-link-custom" to="/destinasi" onClick={() => setIsMobileMenuOpen(false)}>Destinasi</Link>
            
            {/* Navigasi Profil */}
            <div className="d-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border">
              <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Halo, <span style={{ color: '#FFB76C' }}>{user.name.split(' ')[0]}</span></span>
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=FFB76C&color=000&bold=true`} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT PROFIL --- */}
      <div className="container mt-4">
        <div className="row g-lg-5">
          
          {/* KOLOM KIRI: SIDEBAR MENU */}
          <div className="col-lg-3">
            <div className="profile-sidebar anim-fade-up">
              <div className="profile-avatar-container">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=FFB76C&color=000&bold=true&size=200`} alt="Avatar" className="profile-avatar" />
                <h5 className="fw-bold text-dark mb-1">{user.name}</h5>
                <span className="badge bg-light text-secondary border rounded-pill px-3 py-1">Pelanggan</span>
              </div>
              
              <div className="profile-menu">
                <div className={`profile-menu-item ${activeTab === 'akun' ? 'active' : ''}`} onClick={() => setActiveTab('akun')}>
                  <i className="bi bi-person-circle fs-5"></i> Informasi Akun
                </div>
                <div className={`profile-menu-item ${activeTab === 'riwayat' ? 'active' : ''}`} onClick={() => setActiveTab('riwayat')}>
                  <i className="bi bi-ticket-detailed fs-5"></i> Riwayat Pesanan
                </div>
                <div className="profile-menu-item logout" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right fs-5"></i> Keluar Akun
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: KONTEN DINAMIS */}
          <div className="col-lg-9">
            
            {/* TAB 1: INFORMASI AKUN */}
            {activeTab === 'akun' && (
              <div className="profile-content-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="section-title mb-0"><span style={{ color: '#FFB76C' }}>⚙️</span> Informasi Akun</h3>
                  
                  {/* TOMBOL EDIT / SIMPAN */}
                  {!isEditing ? (
                    <button className="btn-outline-custom" onClick={() => setIsEditing(true)}>
                      <i className="bi bi-pencil-square me-1"></i> Edit Profil
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button className="btn btn-light border fw-medium px-3" onClick={() => {
                        setIsEditing(false);
                        setEditName(user.name);
                        setEditPhone(user.phone || user.no_hp || "");
                      }} disabled={isSaving}>Batal</button>
                      <button className="btn-save-custom" onClick={handleUpdateProfile} disabled={isSaving}>
                        {isSaving ? "Menyimpan..." : "Simpan Profil"}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="row g-4 mb-4 mt-2">
                  <div className="col-md-6">
                    <label className="form-label-custom">Nama Lengkap</label>
                    <input 
                      type="text" 
                      className="form-control-custom" 
                      value={isEditing ? editName : user.name} 
                      onChange={(e) => setEditName(e.target.value)}
                      readOnly={!isEditing} 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Alamat Email (Tidak bisa diubah)</label>
                    <input type="email" className="form-control-custom" value={user.email} readOnly />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label-custom">Nomor Handphone / WhatsApp</label>
                    <input 
                      type="tel" 
                      className="form-control-custom" 
                      value={isEditing ? editPhone : (user.phone || user.no_hp || "-")} 
                      onChange={(e) => setEditPhone(e.target.value)}
                      readOnly={!isEditing} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RIWAYAT PESANAN */}
            {activeTab === 'riwayat' && (
              <div className="profile-content-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="section-title"><span style={{ color: '#FFB76C' }}>🧳</span> Riwayat Pesanan</h3>
                <p className="text-muted small mb-4">Klik pada tiket pesanan untuk melihat detail lengkap.</p>
                
                {isLoadingBookings ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-warning" role="status"></div>
                    <p className="text-secondary mt-3">Memuat riwayat perjalanan Anda...</p>
                  </div>
                ) : bookings.length > 0 ? (
                  <div>
                    {bookings.map((booking, index) => {
                      const statusInfo = getStatusDisplay(booking.status);

                      return (
                        <div 
                          key={index} 
                          className="history-card" 
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                            <div>
                              <span className="badge bg-light text-secondary border mb-2">
                                ID: {booking.id || `TRX-${index}`}
                              </span>
                              <h5 className="fw-bold text-dark mb-1">
                                {booking.tour_name || booking.title || "Paket Wisata"}
                              </h5>
                              <span className="text-muted small">
                                <i className="bi bi-calendar-event me-1"></i> 
                                Berangkat: {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('id-ID') : "-"}
                              </span>
                            </div>
                            <div>
                              <span className={`status-badge ${statusInfo.class}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-secondary fw-medium">
                              <i className="bi bi-people-fill me-2"></i> {booking.total_people || 1} Orang
                            </div>
                            <div className="text-end">
                              <p className="text-muted small mb-0">Total Harga</p>
                              <h5 className="fw-bold mb-0" style={{ color: '#111' }}>
                                Rp {Number(booking.total_price || 0).toLocaleString('id-ID')}
                              </h5>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3" style={{ fontSize: '4rem', opacity: '0.2' }}>🏝️</div>
                    <h5 className="fw-bold text-dark mb-2">Belum Ada Pesanan</h5>
                    <p className="text-secondary mb-4">Anda belum pernah melakukan pemesanan paket wisata.</p>
                    <Link to="/tour-packages" className="btn-primary-custom w-auto px-4" style={{ textDecoration: 'none' }}>Cari Paket Wisata</Link>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};

export default UserProfile;