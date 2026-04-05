import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageReviews = () => {
  const navigate = useNavigate();
  
  // State untuk menyimpan berbagai data
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);         // Menyimpan daftar user
  const [packages, setPackages] = useState([]);   // Menyimpan daftar paket tour
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ user_id: '', package_id: '', rating: '5', comment: '' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Ambil data Reviews
      const resReviews = await axios.get('http://localhost:5000/api/reviews', config);
      setReviews(resReviews.data.data || []);

      // 2. Ambil data Paket Tour (untuk Dropdown)
      const resPackages = await axios.get('http://localhost:5000/api/tour_packages', config);
      setPackages(resPackages.data.data || []);

      // 3. Ambil data Users (untuk Dropdown)
      // Pastikan backend kamu sudah punya route untuk '/api/users' ya!
      try {
        const resUsers = await axios.get('http://localhost:5000/api/users', config);
        setUsers(resUsers.data.data || []);
      } catch (userErr) {
        console.warn("API Users belum tersedia atau gagal dimuat.", userErr);
      }

    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', formData, config);
      alert('Review manual berhasil ditambahkan!');
      resetForm();
      fetchData(); // Refresh semua data
    } catch (error) {
      alert(`Gagal menyimpan: ${error.response?.data?.message || error.message}`);
    }
  };

  const confirmDelete = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewToDelete.id}`, config);
      setShowDeleteModal(false);
      setReviewToDelete(null);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus review.");
    }
  };

  const resetForm = () => {
    setFormData({ user_id: '', package_id: '', rating: '5', comment: '' });
    setShowForm(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-warning me-1"></i>);
      }
    }
    return stars;
  };

  const theme = { bgApp: '#f5f5f9', primary: '#696cff', cardShadow: '0 2px 6px 0 rgba(67, 89, 113, 0.12)' };

  return (
    <>
      <style>
        {`
          .sneat-main { margin-left: 260px; padding: 20px; min-height: 100vh; }
          .sneat-card { background: white; border-radius: 8px; border: none; box-shadow: ${theme.cardShadow}; }
          .btn-sneat { background-color: ${theme.primary}; color: white; border: none; }
          .btn-sneat:hover { background-color: #5f61e6; color: white; }
          .table-custom th { background-color: #f8f9fa; color: #566a7f; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
          .modal-backdrop-custom { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(67, 89, 113, 0.5); backdrop-filter: blur(2px); display: flex; justify-content: center; align-items: center; z-index: 1050; }
          .modal-box-custom { background: white; padding: 30px; border-radius: 12px; width: 400px; text-align: center; animation: slideDown 0.3s ease-out; }
          @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}
      </style>

      {/* MODAL HAPUS */}
      {showDeleteModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-box-custom">
            <div className="text-danger mb-3"><i className="bi bi-exclamation-circle" style={{ fontSize: '3.5rem' }}></i></div>
            <h5 className="fw-bold" style={{ color: '#566a7f' }}>Hapus Ulasan?</h5>
            <p className="text-muted mb-4">Apakah Anda yakin ingin menghapus ulasan ini?</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-outline-secondary px-4" onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button className="btn btn-danger px-4" onClick={executeDelete}>Ya, Hapus!</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <Sidebar />

        <main className="sneat-main">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0">Moderasi Ulasan (Reviews)</h4>
            <button className="btn btn-sneat fw-bold shadow-sm" onClick={showForm ? resetForm : () => setShowForm(true)}>
              <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
              {showForm ? 'Batal' : 'Tambah Review Manual'}
            </button>
          </div>

          {showForm && (
            <div className="card sneat-card mb-4 p-4 border-top border-primary border-4">
              <h5 className="fw-bold mb-4">Tambah Review Uji Coba</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  
                  {/* DROPDOWN USER */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Pilih Akun User</label>
                    <select 
                      className="form-select bg-white" 
                      value={formData.user_id} 
                      onChange={(e) => setFormData({...formData, user_id: e.target.value})} 
                      required
                    >
                      <option value="">-- Pilih User Terdaftar --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name || u.username || u.email}</option>
                      ))}
                    </select>
                  </div>

                  {/* DROPDOWN PAKET TOUR */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Pilih Paket Tour</label>
                    <select 
                      className="form-select bg-white" 
                      value={formData.package_id} 
                      onChange={(e) => setFormData({...formData, package_id: e.target.value})} 
                      required
                    >
                      <option value="">-- Pilih Paket Tour --</option>
                      {packages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Penilaian (1-5)</label>
                    <select className="form-select" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})}>
                      <option value="5">⭐⭐⭐⭐⭐ (5 - Sangat Baik)</option>
                      <option value="4">⭐⭐⭐⭐ (4 - Baik)</option>
                      <option value="3">⭐⭐⭐ (3 - Cukup)</option>
                      <option value="2">⭐⭐ (2 - Kurang)</option>
                      <option value="1">⭐ (1 - Buruk)</option>
                    </select>
                  </div>
                  
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold">Komentar / Ulasan</label>
                    <textarea className="form-control" rows="3" value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} required placeholder="Tulis komentar ulasan di sini..."></textarea>
                  </div>
                </div>
                <button type="submit" className="btn btn-sneat px-4">
                  <i className="bi bi-send me-2"></i> Simpan Review
                </button>
              </form>
            </div>
          )}

          <div className="card sneat-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-custom mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">Nama Pelanggan</th>
                    <th>Paket Tour</th>
                    <th>Penilaian (Rating)</th>
                    <th>Komentar</th>
                    <th className="text-center pe-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center py-4">Memuat data...</td></tr>
                  ) : reviews.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-muted">Belum ada ulasan dari pelanggan.</td></tr>
                  ) : (
                    reviews.map((review) => (
                      <tr key={review.id}>
                        <td className="ps-4 fw-bold" style={{ color: theme.primary }}>
                          {review.customer_name || `User ID: ${review.user_id}`}
                        </td>
                        <td><span className="badge bg-light text-dark border px-2 py-1">{review.package_name || `Paket ID: ${review.package_id}`}</span></td>
                        <td>{renderStars(review.rating)}</td>
                        <td className="text-wrap" style={{ maxWidth: '250px' }}>"{review.comment}"</td>
                        <td className="text-center pe-4">
                          <button onClick={() => confirmDelete(review)} className="btn btn-sm btn-outline-danger" title="Hapus Ulasan">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ManageReviews;