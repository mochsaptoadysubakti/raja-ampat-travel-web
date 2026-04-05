import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageDestinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [destToDelete, setDestToDelete] = useState(null);

  // New state for image enlargement modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/destinations', config);
      const fetchedData = response.data.data || [];
      setDestinations(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Gagal mengambil data destinasi", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchDestinations();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/destinations/${editingId}`, formData, config);
        alert('Destinasi diperbarui!');
      } else {
        await axios.post('http://localhost:5000/api/destinations', formData, config);
        alert('Destinasi ditambahkan!');
      }
      resetForm();
      fetchDestinations();
    } catch (error) {
      alert(`Gagal menyimpan: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditClick = (dest) => {
    setFormData({
      name: dest.name, 
      description: dest.description || '', 
      image_url: dest.image_url || dest.image || '' 
    });
    setEditingId(dest.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (dest) => {
    setDestToDelete(dest);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!destToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/destinations/${destToDelete.id}`, config);
      setShowDeleteModal(false);
      setDestToDelete(null);
      fetchDestinations();
    } catch (error) {
      alert("Gagal menghapus destinasi.");
    }
  };

  // Handlers for image modal
  const openImageModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImageUrl('');
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image_url: '' });
    setEditingId(null);
    setShowForm(false);
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

          /* Styles for enlarged image modal */
          .modal-image-box-custom {
            position: relative;
            background: white;
            padding: 10px;
            border-radius: 8px;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          .modal-image-box-custom img {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
          }

          /* Hover and pointer styles for images in the table */
          .destination-table-image {
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          .destination-table-image:hover {
            transform: scale(1.1);
          }
        `}
      </style>

      {/* MODAL KONFIRMASI HAPUS */}
      {showDeleteModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-box-custom">
            <div className="text-danger mb-3"><i className="bi bi-exclamation-circle" style={{ fontSize: '3.5rem' }}></i></div>
            <h5 className="fw-bold" style={{ color: '#566a7f' }}>Hapus Destinasi?</h5>
            <p className="text-muted mb-4">Menghapus <strong>{destToDelete?.name}</strong>? Data akan hilang permanen.</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-outline-secondary px-4" onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button className="btn btn-danger px-4" onClick={executeDelete}>Ya, Hapus!</button>
            </div>
          </div>
        </div>
      )}

      {/* ENLARGED IMAGE MODAL */}
      {showImageModal && (
        <div className="modal-backdrop-custom" onClick={closeImageModal} /* Close on backdrop click */>
          <div className="modal-image-box-custom" onClick={(e) => e.stopPropagation()} /* Prevent closing when clicking the image box */>
            <img src={modalImageUrl} alt="Enlarged destination" className="img-fluid rounded" />
            <button type="button" className="btn-close position-absolute top-0 end-0 m-3" aria-label="Close" onClick={closeImageModal}></button>
          </div>
        </div>
      )}

      <div>
        <Sidebar />

        <main className="sneat-main">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0">Master Data Destinasi</h4>
            <button className="btn btn-sneat fw-bold shadow-sm" onClick={showForm ? resetForm : () => setShowForm(true)}>
              <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
              {showForm ? 'Batal' : 'Tambah Destinasi'}
            </button>
          </div>

          {showForm && (
            <div className="card sneat-card mb-4 p-4 border-top border-primary border-4">
              <h5 className="fw-bold mb-4">{editingId ? 'Edit Destinasi' : 'Tambah Destinasi Baru'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Nama Tempat / Destinasi</label>
                    <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Link Foto (Image URL)</label>
                    <input type="url" className="form-control" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                  </div>
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold">Deskripsi Singkat Lokasi</label>
                    <textarea className="form-control" rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                  </div>
                </div>
                <button type="submit" className="btn btn-sneat px-4">
                  <i className="bi bi-save me-2"></i> {editingId ? 'Simpan Perubahan' : 'Simpan Destinasi'}
                </button>
              </form>
            </div>
          )}

          <div className="card sneat-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-custom mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">Foto & Link URL</th>
                    <th>Nama Destinasi</th>
                    <th>Deskripsi Singkat</th>
                    <th className="text-center pe-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="text-center py-4">Memuat data...</td></tr>
                  ) : destinations.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada data destinasi.</td></tr>
                  ) : (
                    destinations.map((dest) => (
                      <tr key={dest.id}>
                        <td className="ps-4" style={{ maxWidth: '250px' }}>
                          {/* Gambar dengan anti-error, hover effect, and click to enlarge */}
                          <img 
                            src={dest.image_url || dest.image} 
                            alt={dest.name} 
                            className="destination-table-image"
                            style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#e9ecef' }} 
                            onClick={() => openImageModal(dest.image_url || dest.image)}
                            onError={(e) => { 
                              e.target.onerror = null; 
                              e.target.src = 'https://via.placeholder.com/80x50?text=Error'; 
                            }} 
                          />
                          <br />
                          {/* RADAR PELACAK: Menampilkan teks URL langsung di bawah gambar */}
                          <small className="text-muted d-block mt-2" style={{ fontSize: '0.7rem', wordBreak: 'break-all', lineHeight: '1.2' }}>
                            <strong>URL:</strong> {dest.image_url || dest.image || 'Kosong'}
                          </small>
                        </td>
                        <td className="fw-bold" style={{ color: theme.primary }}>{dest.name}</td>
                        <td>{dest.description?.substring(0, 50)}...</td>
                        <td className="text-center pe-4">
                          <button onClick={() => handleEditClick(dest)} className="btn btn-sm btn-outline-primary me-2"><i className="bi bi-pencil"></i></button>
                          <button onClick={() => confirmDelete(dest)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
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

export default ManageDestinations;