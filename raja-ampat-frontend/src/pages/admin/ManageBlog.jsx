import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageBlog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', image_url: '', content: ''
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/blogs', config);
      const fetchedData = response.data.data || [];
      setBlogs(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Gagal mengambil data blog", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchBlogs();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/blogs/${editingId}`, formData, config);
        alert('Artikel berhasil diperbarui!');
      } else {
        await axios.post('http://localhost:5000/api/blogs', formData, config);
        alert('Artikel berhasil ditambahkan!');
      }
      resetForm();
      fetchBlogs();
    } catch (error) {
      alert(`Gagal menyimpan: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditClick = (blog) => {
    setFormData({
      title: blog.title, author: blog.author || '', 
      image_url: blog.image_url || '', content: blog.content || ''
    });
    setEditingId(blog.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!blogToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogToDelete.id}`, config);
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (error) {
      alert("Gagal menghapus artikel.");
    }
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', image_url: '', content: '' });
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
        `}
      </style>

      {/* Pop-up Hapus */}
      {showDeleteModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-box-custom">
            <div className="text-danger mb-3"><i className="bi bi-exclamation-circle" style={{ fontSize: '3.5rem' }}></i></div>
            <h5 className="fw-bold" style={{ color: '#566a7f' }}>Hapus Artikel?</h5>
            <p className="text-muted mb-4">Apakah Anda yakin ingin menghapus artikel <strong>{blogToDelete?.title}</strong>?</p>
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
            <h4 className="fw-bold m-0">Kelola Artikel Blog</h4>
            <button className="btn btn-sneat fw-bold shadow-sm" onClick={showForm ? resetForm : () => setShowForm(true)}>
              <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
              {showForm ? 'Batal' : 'Tulis Artikel Baru'}
            </button>
          </div>

          {showForm && (
            <div className="card sneat-card mb-4 p-4 border-top border-primary border-4">
              <h5 className="fw-bold mb-4">{editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label fw-semibold">Judul Artikel</label>
                    <input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Penulis</label>
                    <input type="text" className="form-control" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold">Link Foto Cover (Image URL)</label>
                    <input type="url" className="form-control" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                  </div>
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold">Konten Artikel</label>
                    <textarea className="form-control" rows="8" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required></textarea>
                  </div>
                </div>
                <button type="submit" className="btn btn-sneat px-4">
                  <i className="bi bi-send me-2"></i> {editingId ? 'Simpan Perubahan' : 'Publish Artikel'}
                </button>
              </form>
            </div>
          )}

          <div className="card sneat-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-custom mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">Cover</th>
                    <th>Judul Artikel</th>
                    <th>Penulis</th>
                    <th className="text-center pe-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="text-center py-4">Memuat data...</td></tr>
                  ) : blogs.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada artikel blog.</td></tr>
                  ) : (
                    blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td className="ps-4">
                          <img src={blog.image_url} alt={blog.title} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} onError={(e) => e.target.src = 'https://via.placeholder.com/80x50?text=No+Img'} />
                        </td>
                        <td className="fw-bold" style={{ color: theme.primary }}>{blog.title}</td>
                        <td>{blog.author || '-'}</td>
                        <td className="text-center pe-4">
                          <button onClick={() => handleEditClick(blog)} className="btn btn-sm btn-outline-primary me-2">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button onClick={() => confirmDelete(blog)} className="btn btn-sm btn-outline-danger">
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

export default ManageBlog;