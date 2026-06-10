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
  
  // --- STATE ANIMASI & EDIT PROFIL ---
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE RIWAYAT PESANAN & MODAL ---
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); // State untuk Pop-up

  // --- NEW STATE: POP-UP REVIEW/ULASAN ---
  const [bookingToReview, setBookingToReview] = useState(null); // Menyimpan objek paket yang akan direview
  const [reviewRating, setReviewRating] = useState(5); // Rating bintang default 5
  const [reviewComment, setReviewComment] = useState(""); // Komentar ulasan
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
      
      setEditName(parsedUser.name || "");
      setEditPhone(parsedUser.phone || parsedUser.no_hp || "");
      
      fetchBookingHistory(parsedUser.id, token);
    }
  }, [navigate]);

  // Fungsi Tarik Riwayat Pesanan
  const fetchBookingHistory = async (userId, token) => {
    try {
      // ✅ DIPERBAIKI: Menggunakan variabel environment
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/user/${userId}`, {
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

      // ✅ DIPERBAIKI: Menggunakan variabel environment
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = { ...user, name: editName, phone: editPhone, no_hp: editPhone };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));

      setShowSuccessAnim(true);
      setTimeout(() => {
        setShowSuccessAnim(false);
        setIsEditing(false);
      }, 2000);

    } catch (error) {
      console.error("Detail Error Update Profil:", error.response || error);
      const errorMsg = error.response?.data?.message 
                    || error.response?.data?.error 
                    || "Gagal menyimpan perubahan.";
      alert(`Gagal menyimpan: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- FUNGSI KLIK TOMBOL REVIEW ---
  const handleOpenReviewModal = (booking) => {
    setBookingToReview(booking);
    setReviewRating(5); // Reset ke bintang 5 saat membuka pop-up baru
    setReviewComment(""); // Kosongkan text ulasan sebelumnya
  };

  // --- FUNGSI SUBMIT ULASAN (POP-UP) ---
  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      alert("Silakan tulis komentar ulasan Anda terlebih dahulu!");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem('userToken');
      const configHeaders = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // ✅ SUDAH DIAKTIFKAN: Mengirim data review ke Backend Database Railway
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
        booking_id: bookingToReview.id,
        rating: reviewRating,
        comment: reviewComment
      }, configHeaders);

      alert(`Terima kasih atas ulasan Anda! ❤️`);
      setBookingToReview(null); // Tutup pop-up modal setelah sukses submit
      
      // Opsional: Refresh riwayat pesanan (barangkali ada status berubah dsb)
      fetchBookingHistory(user.id, token);
    } catch (error) {
      console.error("Gagal mengirim ulasan:", error);
      alert("Terjadi kesalahan saat mengirim ulasan ke server.");
    } finally {
      setIsSubmittingReview(false);
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
    if (statusLower.includes('confirmed') || statusLower.includes('lunas') || statusLower.includes('success') || statusLower.includes('settlement')) {
      return { 
        badgeClass: 'badge-confirmed', 
        label: 'Terkonfirmasi', 
        icon: 'bi-check-circle',
        btnClass: 'btn-outline-confirmed'
      };
    } else if (statusLower.includes('cancel') || statusLower.includes('batal')) {
      return { 
        badgeClass: 'badge-cancelled', 
        label: 'Dibatalkan', 
        icon: 'bi-x-circle',
        btnClass: 'btn-outline-secondary'
      };
    }
    return { 
      badgeClass: 'badge-pending', 
      label: 'Pending', 
      icon: 'bi-clock',
      btnClass: 'btn-outline-pending'
    };
  };

  if (!user) return null;

  return (
    <div style={{ backgroundColor: '#F4F7FE', minHeight: '100vh', paddingTop: '70px', paddingBottom: '80px' }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #F4F7FE; }
          h1, h2, h3, h4, h5, h6, .brand-text { font-family: 'Poppins', sans-serif; }

          .nav-link-custom { transition: color 0.3s ease; color: #555; }
          .nav-link-custom:hover { color: #000 !important; }

          .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); z-index: 1050; display: flex; justify-content: center; align-items: center; padding: 20px; animation: fadeIn 0.3s forwards;}
          .modal-content-small { background-color: #fff; border-radius: 20px; max-width: 400px; width: 100%; padding: 40px 20px; text-align: center; }
          .modal-content-large { background-color: #fff; border-radius: 24px; max-width: 500px; width: 100%; padding: 30px; text-align: left; box-shadow: 0 25px 50px rgba(0,0,0,0.15); animation: scaleUp 0.3s forwards; overflow-y: auto; max-height: 90vh; }
          
          .spinner-custom { width: 50px; height: 50px; border: 4px solid rgba(255, 183, 108, 0.3); border-top-color: #FFB76C; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto; }
          
          .success-checkmark { width: 60px; height: 60px; border-radius: 50%; background-color: #10B981; color: white; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: bold; margin: 0 auto 20px auto; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }

          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }
          @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

          .profile-sidebar { background: #fff; border-radius: 20px; padding: 30px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
          .profile-avatar-container { text-align: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 25px; margin-bottom: 20px; }
          .profile-avatar { width: 100px; height: 100px; border-radius: 50%; border: 4px solid #F4F7FE; box-shadow: 0 5px 15px rgba(255, 183, 108, 0.3); margin-bottom: 15px; }
          
          .profile-menu-item { display: flex; align-items: center; gap: 15px; padding: 14px 20px; border-radius: 12px; color: #64748B; font-weight: 600; text-decoration: none; transition: all 0.3s; cursor: pointer; margin-bottom: 8px; border: 1px solid transparent; }
          .profile-menu-item:hover { background-color: #F8F9FA; color: #111; }
          .profile-menu-item.active { background-color: #FFF5EC; color: #FFB76C; border-color: #FFE0C2; }
          .profile-menu-item.logout { color: #E53E3E; margin-top: 20px; }
          .profile-menu-item.logout:hover { background-color: #FFF5F5; }

          .profile-content-card { background: #fff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); min-height: 500px; }
          .section-title { font-weight: 700; color: #111; margin-bottom: 30px; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; }
          
          .form-label-custom { font-weight: 600; color: #475569; font-size: 0.9rem; margin-bottom: 8px; display: block; }
          .form-control-custom { background-color: #F8F9FA; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 18px; font-size: 0.95rem; color: #111; transition: all 0.3s; width: 100%; }
          .form-control-custom:read-only { background-color: #E2E8F0; color: #64748B; cursor: not-allowed; }
          .form-control-custom:not(:read-only) { background-color: #fff; border-color: #FFB76C; box-shadow: 0 0 0 3px rgba(255, 183, 108, 0.1); }

          .btn-primary-custom { background-color: #111; color: #fff; font-weight: 700; border-radius: 12px; padding: 14px 30px; border: none; transition: all 0.3s; width: 100%; }
          .btn-primary-custom:hover { background-color: #FFB76C; color: #111; }

          .btn-outline-custom { border: 1px solid #111; color: #111; font-weight: 600; border-radius: 8px; padding: 8px 16px; background: transparent; transition: all 0.3s; font-size: 0.9rem; }
          .btn-outline-custom:hover { background: #111; color: #fff; }
          .btn-save-custom { background-color: #111; color: #fff; font-weight: 600; border-radius: 8px; padding: 8px 24px; border: none; transition: all 0.3s; font-size: 0.9rem; }
          .btn-save-custom:hover { background-color: #FFB76C; color: #111; }

          /* --- STYLING TIKET RIWAYAT PESANAN BARU --- */
          .history-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin-bottom: 24px; transition: all 0.3s; display: flex; gap: 24px; }
          .history-card:hover { border-color: #FFB76C; box-shadow: 0 10px 25px rgba(255, 183, 108, 0.15); }
          
          .history-img-container { width: 240px; height: 180px; flex-shrink: 0; position: relative; border-radius: 12px; overflow: hidden; }
          .history-img { width: 100%; height: 100%; object-fit: cover; }
          .history-duration { position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.65); color: #fff; font-size: 0.8rem; font-weight: 600; padding: 4px 10px; border-radius: 6px; backdrop-filter: blur(4px); }
          
          .ticket-vertical-divider { width: 1px; background-color: #E2E8F0; height: 40px; margin: 0 20px; }
          
          .badge-pending { background-color: #FFF3E0; color: #F97316; padding: 6px 14px; border-radius: 30px; font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; }
          .badge-confirmed { background-color: #D1FAE5; color: #10B981; padding: 6px 14px; border-radius: 30px; font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; }
          .badge-cancelled { background-color: #FEE2E2; color: #EF4444; padding: 6px 14px; border-radius: 30px; font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; }

          .btn-outline-pending { border: 1px solid #F97316; color: #F97316; background: transparent; border-radius: 8px; font-weight: 600; padding: 8px 16px; width: 100%; transition: 0.3s; font-size: 0.9rem; }
          .btn-outline-pending:hover { background: #F97316; color: white; }
          
          .btn-outline-confirmed { border: 1px solid #10B981; color: #10B981; background: transparent; border-radius: 8px; font-weight: 600; padding: 8px 16px; width: 100%; transition: 0.3s; font-size: 0.9rem; }
          .btn-outline-confirmed:hover { background: #10B981; color: white; }

          .btn-outline-download { border: 1px solid #CBD5E1; color: #475569; background: transparent; border-radius: 8px; font-weight: 600; padding: 8px 16px; width: 100%; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 10px; font-size: 0.9rem; }
          .btn-outline-download:hover { background: #F8F9FA; color: #0F172A; }

          /* --- STYLING BUTTON REVIEW BARU --- */
          .btn-outline-review { border: 1px solid #FFB76C; color: #111; background: transparent; border-radius: 8px; font-weight: 600; padding: 8px 16px; width: 100%; transition: 0.3s; display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 10px; font-size: 0.9rem; }
          .btn-outline-review:hover { background: #FFF5EC; color: #FFB76C; }

          .btn-close-custom { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; cursor: pointer; transition: 0.2s;}
          .btn-close-custom:hover { background: #e2e8f0; color: #e53e3e; }

          .btn-wa { background-color: #25D366; color: white; border: none; border-radius: 12px; padding: 12px; font-weight: 600; transition: all 0.3s; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px;}
          .btn-wa:hover { background-color: #1ebc59; color: white; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3); }

          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .anim-fade-up { animation: fadeInUp 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }

          @media (max-width: 991px) {
            .profile-content-card { padding: 25px; margin-top: 20px; }
            .history-card { flex-direction: column; }
            .history-img-container { width: 100%; height: 200px; }
            .ticket-vertical-divider { display: none; }
            .ticket-details-mobile { flex-direction: column; gap: 15px; margin-top: 15px;}
            .history-action-area { align-items: flex-start !important; margin-top: 10px; border-top: 1px solid #E2E8F0; padding-top: 15px;}
          }
        `}
      </style>

      {/* --- POPUPS --- */}
      {showSuccessAnim && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content-small" style={{ animation: 'scaleUp 0.3s forwards' }}>
            <div className="success-checkmark">✓</div>
            <h4 className="fw-bold text-dark mb-2">Berhasil!</h4>
            <p className="text-secondary small mb-0">Profil Anda telah berhasil diperbarui.</p>
          </div>
        </div>
      )}

      {showLogoutAnim && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content-small">
            <div className="spinner-custom"></div>
            <h4 className="fw-bold text-dark mb-2">Sampai Jumpa!</h4>
            <p className="text-secondary small mb-0">Sedang mengeluarkan akun Anda...</p>
          </div>
        </div>
      )}

      {/* POP-UP DETAIL TRANSKASI */}
      {selectedBooking && (
        <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={() => setSelectedBooking(null)}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0 text-dark">Detail Pemesanan</h4>
              <button className="btn-close-custom" onClick={() => setSelectedBooking(null)}>✕</button>
            </div>
            
            <div className="p-3 bg-light rounded-3 mb-4 border">
              <span className={`${getStatusDisplay(selectedBooking.status).badgeClass} mb-2`}>
                 <i className={`bi ${getStatusDisplay(selectedBooking.status).icon}`}></i> {getStatusDisplay(selectedBooking.status).label}
              </span>
              <div className="text-muted small mt-2">ID Transaksi: <strong>{selectedBooking.id || selectedBooking.booking_id || `TRX-${selectedBooking.id}`}</strong></div>
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
                <span className="fw-medium text-dark text-end">{selectedBooking.tour_name || selectedBooking.title || selectedBooking.package_name || "Paket Wisata"}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                <span className="text-muted">Tanggal Keberangkatan</span>
                <span className="fw-medium text-dark text-end">{selectedBooking.booking_date ? new Date(selectedBooking.booking_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : "-"}</span>
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

      {/* --- NEW MODAL: POP-UP BERI ULASAN / REVIEW --- */}
      {bookingToReview && (
        <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={() => setBookingToReview(null)}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0 text-dark">Beri Ulasan Paket</h4>
              <button className="btn-close-custom" onClick={() => setBookingToReview(null)}>✕</button>
            </div>
            
            <p className="text-muted small mb-4">
              Bagikan pengalaman seru Anda setelah berwisata di <strong>{bookingToReview.tour_name || bookingToReview.title || bookingToReview.package_name || "Paket Wisata"}</strong>.
            </p>

            {/* Area Bintang Rating Interaktif */}
            <div className="text-center mb-4 p-3 bg-light rounded-4 border">
              <label className="form-label-custom d-block mb-2 text-dark">Rating Kepuasan Anda</label>
              <div className="d-flex justify-content-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi ${star <= reviewRating ? "bi-star-fill text-warning" : "bi-star text-muted"} fs-2`}
                    style={{ cursor: "pointer", transition: "transform 0.1s" }}
                    onClick={() => setReviewRating(star)}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  ></i>
                ))}
              </div>
              <span className="badge bg-white border text-dark mt-2 fw-bold px-3">
                {reviewRating === 5 ? "🤩 Sangat Puas (5/5)" :
                 reviewRating === 4 ? "😊 Puas (4/5)" :
                 reviewRating === 3 ? "😐 Cukup (3/5)" :
                 reviewRating === 2 ? "🙁 Kurang Puas (2/5)" : "😭 Sangat Kecewa (1/5)"}
              </span>
            </div>

            {/* Input Komentar */}
            <div className="mb-4">
              <label className="form-label-custom">Komentar / Catatan Review</label>
              <textarea
                className="form-control-custom"
                rows="4"
                placeholder="Ceritakan detail keseruan pemandangan, kenyamanan penginapan, keramahan guide lokal, dll..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Tombol Aksi */}
            <button className="btn-primary-custom w-100 py-3 rounded-3" onClick={handleSubmitReview} disabled={isSubmittingReview}>
              {isSubmittingReview ? "Mengirim..." : "Kirim Ulasan Sekarang"}
            </button>
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
            
            <div className="d-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border">
              <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Halo, <span style={{ color: '#FFB76C' }}>{user.name.split(' ')[0]}</span></span>
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=FFB76C&color=000&bold=true`} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="container mt-4">
        <div className="row g-lg-5">
          
          {/* SIDEBAR MENU */}
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

          {/* KONTEN DINAMIS */}
          <div className="col-lg-9">
            
            {/* TAB 1: INFORMASI AKUN */}
            {activeTab === 'akun' && (
              <div className="profile-content-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="section-title mb-0"><span style={{ color: '#FFB76C' }}>⚙️</span> Informasi Akun</h3>
                  
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
                <h3 className="section-title"><span style={{ fontSize: '1.8 rem' }}></span> Riwayat Pesanan</h3>
                <p className="text-muted small mb-4">Berikut adalah daftar pesanan paket wisata Anda.</p>
                
                {isLoadingBookings ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-warning" role="status"></div>
                    <p className="text-secondary mt-3">Memuat riwayat perjalanan Anda...</p>
                  </div>
                ) : bookings.length > 0 ? (
                  <div>
                    {bookings.map((booking, index) => {
                      const statusInfo = getStatusDisplay(booking.status);
                      const imageUrl = booking.image || booking.tour_image || booking.thumbnail || "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=600&q=80";

                      return (
                        <div key={index} className="history-card">
                          
                          {/* Gambar & Durasi */}
                          <div className="history-img-container">
                            <img src={imageUrl} alt={booking.tour_name} className="history-img" />
                            <div className="history-duration">
                              <i className="bi bi-clock"></i> {booking.duration || "3H2M"}
                            </div>
                          </div>

                          {/* Detail Info Tengah */}
                          <div className="flex-grow-1 py-1">
                            <span className="badge bg-light text-secondary border mb-2 px-2 py-1" style={{ fontSize: '0.75rem'}}>ID: {booking.id || 20 + index}</span>
                            <h5 className="fw-bold text-dark mb-3" style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>
                              {booking.tour_name || booking.title || booking.package_name || "Paket Eksklusif Raja Ampat 3H2M"}
                            </h5>
                            
                            <div className="d-flex align-items-center ticket-details-mobile">
                              <div>
                                <p className="text-muted small mb-1"><i className="bi bi-calendar3 me-1"></i> Tanggal Berangkat</p>
                                <p className="fw-medium text-dark mb-0">
                                  {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'}) : "-"}
                                </p>
                              </div>
                              <div className="ticket-vertical-divider"></div>
                              <div>
                                <p className="text-muted small mb-1"><i className="bi bi-people me-1"></i> Jumlah Peserta</p>
                                <p className="fw-medium text-dark mb-0">{booking.total_people || 1} Orang</p>
                              </div>
                            </div>
                          </div>

                          {/* Status, Harga, Actions Kanan */}
                          <div className="history-action-area d-flex flex-column justify-content-between align-items-lg-end" style={{ minWidth: '180px' }}>
                            <div className={statusInfo.badgeClass}>
                              <i className={`bi ${statusInfo.icon}`}></i> {statusInfo.label}
                            </div>
                            
                            <div className="text-lg-end w-100 mt-3 mb-3">
                              <p className="text-muted small mb-1">Total Harga</p>
                              <h5 className="fw-bold text-dark mb-0">Rp {Number(booking.total_price || 0).toLocaleString('id-ID')}</h5>
                            </div>
                            
                            <div className="w-100">
                              <button className={statusInfo.btnClass} onClick={() => setSelectedBooking(booking)}>
                                Lihat Detail <i className="bi bi-arrow-right ms-1"></i>
                              </button>
                              
                              {/* Tampilkan Download Tiket & Beri Ulasan Hanya Jika Terkonfirmasi */}
                              {statusInfo.label === 'Terkonfirmasi' && (
                                <>
                                  <button className="btn-outline-download" onClick={() => alert("Fitur download tiket sedang dikembangkan!")}>
                                    Download Tiket <i className="bi bi-download"></i>
                                  </button>
                                  
                                  {/* ✅ BUTTON BERI ULASAN BARU */}
                                  <button className="btn-outline-review" onClick={() => handleOpenReviewModal(booking)}>
                                    Beri Ulasan <i className="bi bi-star-fill text-warning"></i>
                                  </button>
                                </>
                              )}
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