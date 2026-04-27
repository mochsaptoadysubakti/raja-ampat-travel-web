import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageGallery = () => {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // State disesuaikan dengan kolom database: title, image, description
  const [formData, setFormData] = useState({ title: '', image: '', description: '' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchGalleries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/gallery', config);
      const fetchedData = response.data.data || response.data || [];
      setGalleries(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Gagal mengambil data galeri", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchGalleries();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/gallery/${editingId}`, formData, config);
        alert('Data galeri diperbarui!');
      } else {
        await axios.post('http://localhost:5000/api/gallery', formData, config);
        alert('Data galeri ditambahkan!');
      }
      resetForm();
      fetchGalleries();
    } catch (error) {
      alert(`Gagal menyimpan: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditClick = (gal) => {
    setFormData({
      title: gal.title || '', 
      image: gal.image || '',
      description: gal.description || '' 
    });
    setEditingId(gal.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (gal) => {
    setGalleryToDelete(gal);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!galleryToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/gallery/${galleryToDelete.id}`, config);
      setShowDeleteModal(false);
      setGalleryToDelete(null);
      fetchGalleries();
    } catch (error) {
      alert("Gagal menghapus foto galeri.");
    }
  };

  const openImageModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImageUrl('');
  };

  const resetForm = () => {
    setFormData({ title: '', image: '', description: '' });
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
            <h5 className="fw-bold" style={{ color: '#566a7f' }}>Hapus Data Galeri?</h5>
            <p className="text-muted mb-4">Menghapus <strong>{galleryToDelete?.title}</strong>? Data akan hilang permanen.</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-outline-secondary px-4" onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button className="btn btn-danger px-4" onClick={executeDelete}>Ya, Hapus!</button>
            </div>
          </div>
        </div>
      )}

      {/* ENLARGED IMAGE MODAL */}
      {showImageModal && (
        <div className="modal-backdrop-custom" onClick={closeImageModal}>
          <div className="modal-image-box-custom" onClick={(e) => e.stopPropagation()}>
            <img src={modalImageUrl} alt="Enlarged gallery" className="img-fluid rounded" />
            <button type="button" className="btn-close position-absolute top-0 end-0 m-3" aria-label="Close" onClick={closeImageModal}></button>
          </div>
        </div>
      )}

      <div>
        <Sidebar />

        <main className="sneat-main">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0">Kelola Galeri</h4>
            <button className="btn btn-sneat fw-bold shadow-sm" onClick={showForm ? resetForm : () => setShowForm(true)}>
              <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
              {showForm ? 'Batal' : 'Tambah Foto'}
            </button>
          </div>

          {showForm && (
            <div className="card sneat-card mb-4 p-4 border-top border-primary border-4">
              <h5 className="fw-bold mb-4">{editingId ? 'Edit Data Galeri' : 'Tambah Foto Baru'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Judul Foto (Title)</label>
                    <input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Link Foto (Image URL)</label>
                    <input type="url" className="form-control" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} required />
                  </div>
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold">Deskripsi (Description)</label>
                    <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                  </div>
                </div>
                <button type="submit" className="btn btn-sneat px-4">
                  <i className="bi bi-save me-2"></i> {editingId ? 'Simpan Perubahan' : 'Simpan ke Galeri'}
                </button>
              </form>
            </div>
          )}

          <div className="card sneat-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-custom mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4" style={{ width: '25%' }}>Foto & Link URL</th>
                    <th style={{ width: '25%' }}>Judul Foto</th>
                    <th style={{ width: '35%' }}>Deskripsi</th>
                    <th className="text-center pe-4" style={{ width: '15%' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="text-center py-4">Memuat data...</td></tr>
                  ) : galleries.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada data di galeri.</td></tr>
                  ) : (
                    galleries.map((gal) => (
                      <tr key={gal.id}>
                        <td className="ps-4">
                          <img 
                            src={gal.image} 
                            alt={gal.title} 
                            className="destination-table-image"
                            style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#e9ecef' }} 
                            onClick={() => openImageModal(gal.image)}
                            onError={(e) => { 
                              e.target.onerror = null; 
                              e.target.src = 'https://via.placeholder.com/80x50?text=Error'; 
                            }} 
                          />
                          <br />
                          <small className="text-muted d-block mt-2" style={{ fontSize: '0.7rem', wordBreak: 'break-all', lineHeight: '1.2' }}>
                            <strong>URL:</strong> {gal.image || 'Kosong'}
                          </small>
                        </td>
                        <td className="fw-bold" style={{ color: theme.primary }}>{gal.title}</td>
                        <td>{gal.description}</td>
                        <td className="text-center pe-4">
                          <button onClick={() => handleEditClick(gal)} className="btn btn-sm btn-outline-primary me-2"><i className="bi bi-pencil"></i></button>
                          <button onClick={() => confirmDelete(gal)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
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

export default ManageGallery;