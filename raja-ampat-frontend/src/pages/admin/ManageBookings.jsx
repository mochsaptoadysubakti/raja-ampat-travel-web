import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal Hapus
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/bookings', config);
      const fetchedData = response.data.data || [];
      setBookings(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Gagal mengambil data bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchBookings();
  }, [navigate]);

  // Fungsi untuk mengubah status pesanan langsung dari dropdown
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus }, config);
      // Update state lokal agar tabel langsung berubah tanpa perlu refresh
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert("Gagal merubah status: " + (error.response?.data?.message || error.message));
    }
  };

  const confirmDelete = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!bookingToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingToDelete.id}`, config);
      setShowDeleteModal(false);
      setBookingToDelete(null);
      fetchBookings();
    } catch (error) {
      alert("Gagal menghapus booking.");
    }
  };

  const theme = { bgApp: '#f5f5f9', primary: '#696cff', cardShadow: '0 2px 6px 0 rgba(67, 89, 113, 0.12)' };

  // Fungsi untuk memberi warna pada status
  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'confirmed' || s === 'success') return 'bg-label-success text-success';
    if (s === 'cancelled' || s === 'failed') return 'bg-label-danger text-danger';
    return 'bg-label-warning text-warning'; // Default pending
  };

  return (
    <>
      <style>
        {`
          .sneat-main { margin-left: 260px; padding: 20px; min-height: 100vh; }
          .sneat-card { background: white; border-radius: 8px; border: none; box-shadow: ${theme.cardShadow}; }
          .table-custom th { background-color: #f8f9fa; color: #566a7f; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
          .bg-label-success { background-color: #e8fadf; padding: 5px 10px; border-radius: 5px; font-weight: 600; font-size: 0.8rem; }
          .bg-label-warning { background-color: #fff2d6; padding: 5px 10px; border-radius: 5px; font-weight: 600; font-size: 0.8rem; }
          .bg-label-danger { background-color: #ffe0db; padding: 5px 10px; border-radius: 5px; font-weight: 600; font-size: 0.8rem; }
          
          /* Modal Styles Sama Seperti Manage Packages */
          .modal-backdrop-custom { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(67, 89, 113, 0.5); backdrop-filter: blur(2px); display: flex; justify-content: center; align-items: center; z-index: 1050; }
          .modal-box-custom { background: white; padding: 30px; border-radius: 12px; width: 400px; text-align: center; animation: slideDown 0.3s ease-out; }
          @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}
      </style>

      {/* Pop-up Hapus */}
      {showDeleteModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-box-custom">
            <div className="text-danger mb-3"><i className="bi bi-exclamation-circle" style={{ fontSize: '3.5rem' }}></i></div>
            <h5 className="fw-bold" style={{ color: '#566a7f' }}>Hapus Pemesanan?</h5>
            <p className="text-muted mb-4">Apakah Anda yakin ingin menghapus data booking ini? Data ini akan hilang permanen.</p>
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
            <h4 className="fw-bold m-0">Daftar Pemesanan (Bookings)</h4>
          </div>

          <div className="card sneat-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-custom mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">ID</th>
                    <th>Nama Pelanggan</th>
                    <th>ID Paket / Layanan</th>
                    <th>Total Harga</th>
                    <th>Status</th>
                    <th className="text-center pe-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="6" className="text-center py-4">Memuat data...</td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4 text-muted">Belum ada data pemesanan.</td></tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="ps-4 fw-bold">#{booking.id}</td>
                        {/* Sesuaikan nama properti (customer_name, package_id, dll) dengan kolom di PostgreSQL kamu! */}
                        <td className="fw-bold" style={{ color: theme.primary }}>{booking.customer_name || 'Tanpa Nama'}</td>
                        <td>{booking.package_id || '-'}</td>
                        <td className="fw-semibold">Rp {parseInt(booking.total_price || 0).toLocaleString('id-ID')}</td>
                        <td>
                          {/* Dropdown untuk mengubah status langsung dari tabel */}
                          <select 
                            className={`form-select form-select-sm shadow-none border-0 ${getStatusBadge(booking.status)}`}
                            value={booking.status || 'pending'}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            style={{ cursor: 'pointer', width: 'auto' }}
                          >
                            <option value="pending" className="text-dark bg-white">Pending</option>
                            <option value="confirmed" className="text-dark bg-white">Confirmed</option>
                            <option value="cancelled" className="text-dark bg-white">Cancelled</option>
                          </select>
                        </td>
                        <td className="text-center pe-4">
                          <button onClick={() => confirmDelete(booking)} className="btn btn-sm btn-outline-danger">
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

export default ManageBookings;