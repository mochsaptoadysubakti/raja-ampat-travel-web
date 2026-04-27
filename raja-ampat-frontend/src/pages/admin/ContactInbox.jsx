import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ContactInbox = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  const [showReadModal, setShowReadModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  
  // Sesuaikan dengan nama rute di backend-mu (biasanya /api/contacts)
  const API_URL = 'http://localhost:5000/api/contacts'; 

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL, config);
      const fetchedData = response.data.data || response.data || [];
      setMessages(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Gagal mengambil data pesan", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchMessages();
  }, [navigate]);

  // Fungsi Hapus Pesan
  const confirmDelete = (msg) => {
    setMessageToDelete(msg);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!messageToDelete) return;
    try {
      await axios.delete(`${API_URL}/${messageToDelete.id}`, config);
      setShowDeleteModal(false);
      setMessageToDelete(null);
      fetchMessages();
    } catch (error) {
      alert("Gagal menghapus pesan.");
    }
  };

  // Fungsi Buka Pesan
  const openReadModal = (msg) => {
    setSelectedMessage(msg);
    setShowReadModal(true);
  };

  // Format Tanggal jadi lebih rapi
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
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
          .modal-box-custom { background: white; padding: 30px; border-radius: 12px; width: 500px; text-align: left; animation: slideDown 0.3s ease-out; }
          @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          
          .message-row { cursor: pointer; transition: background-color 0.2s; }
          .message-row:hover { background-color: #f8f9fa; }
        `}
      </style>

      {/* MODAL KONFIRMASI HAPUS */}
      {showDeleteModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-box-custom text-center" style={{ width: '400px' }}>
            <div className="text-danger mb-3"><i className="bi bi-trash" style={{ fontSize: '3.5rem' }}></i></div>
            <h5 className="fw-bold" style={{ color: '#566a7f' }}>Hapus Pesan?</h5>
            <p className="text-muted mb-4">Pesan dari <strong>{messageToDelete?.name}</strong> akan dihapus permanen.</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-outline-secondary px-4" onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button className="btn btn-danger px-4" onClick={executeDelete}>Ya, Hapus!</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BACA DETAIL PESAN */}
      {showReadModal && selectedMessage && (
        <div className="modal-backdrop-custom" onClick={() => setShowReadModal(false)}>
          <div className="modal-box-custom" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold m-0" style={{ color: theme.primary }}>Detail Pesan Masuk</h5>
              <button type="button" className="btn-close" onClick={() => setShowReadModal(false)}></button>
            </div>
            <div className="mb-3">
              <small className="text-muted d-block">Dari:</small>
              <span className="fw-bold">{selectedMessage.name}</span> &lt;<a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>&gt;
            </div>
            <div className="mb-3">
              <small className="text-muted d-block">Tanggal Masuk:</small>
              <span>{formatDate(selectedMessage.created_at)}</span>
            </div>
            <div className="mb-4">
              <small className="text-muted d-block mb-1">Isi Pesan:</small>
              <div className="p-3 bg-light rounded border" style={{ whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
                {selectedMessage.message}
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <a href={`mailto:${selectedMessage.email}`} className="btn btn-sneat me-2">
                <i className="bi bi-reply me-2"></i> Balas via Email
              </a>
              <button className="btn btn-outline-secondary" onClick={() => setShowReadModal(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <Sidebar />

        <main className="sneat-main">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0">Kotak Masuk (Inbox)</h4>
            <button className="btn btn-sneat fw-bold shadow-sm" onClick={fetchMessages}>
              <i className="bi bi-arrow-clockwise me-2"></i> Segarkan
            </button>
          </div>

          <div className="card sneat-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-custom mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4" style={{ width: '20%' }}>Pengirim</th>
                    <th style={{ width: '25%' }}>Email</th>
                    <th style={{ width: '30%' }}>Cuplikan Pesan</th>
                    <th style={{ width: '15%' }}>Tanggal</th>
                    <th className="text-center pe-4" style={{ width: '10%' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center py-4">Memuat pesan...</td></tr>
                  ) : messages.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        Belum ada pesan masuk.
                      </td>
                    </tr>
                  ) : (
                    messages.map((msg) => (
                      <tr key={msg.id} className="message-row">
                        <td className="ps-4 fw-bold" style={{ color: theme.primary }} onClick={() => openReadModal(msg)}>
                          {msg.name}
                        </td>
                        <td onClick={() => openReadModal(msg)}>{msg.email}</td>
                        <td className="text-muted" onClick={() => openReadModal(msg)}>
                          {/* Potong pesan kalau terlalu panjang */}
                          {msg.message?.substring(0, 40)}{msg.message?.length > 40 ? '...' : ''}
                        </td>
                        <td onClick={() => openReadModal(msg)}>
                          <span className="badge bg-light text-secondary border">
                            {formatDate(msg.created_at)}
                          </span>
                        </td>
                        <td className="text-center pe-4">
                          <button onClick={() => confirmDelete(msg)} className="btn btn-sm btn-outline-danger">
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

export default ContactInbox;