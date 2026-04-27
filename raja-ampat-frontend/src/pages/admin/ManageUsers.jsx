import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // State form ditambahkan 'phone'
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const API_URL = 'http://localhost:5000/api/users'; 

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL, config);
      const fetchedData = response.data.data || response.data || [];
      setUsers(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Gagal mengambil data user", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchUsers();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, {
          name: formData.name, email: formData.email, phone: formData.phone, role: formData.role
        }, config);
        alert('Data user diperbarui!');
      } else {
        await axios.post(API_URL, formData, config);
        alert('User baru ditambahkan!');
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      alert(`Gagal menyimpan: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditClick = (usr) => {
    setFormData({
      name: usr.name || '', 
      email: usr.email || '',
      password: '', // Kosongkan demi keamanan
      phone: usr.phone || '', // Set nomor HP
      role: usr.role || 'user' 
    });
    setEditingId(usr.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (usr) => {
    setUserToDelete(usr);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`${API_URL}/${userToDelete.id}`, config);
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      alert("Gagal menghapus user.");
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', phone: '', role: 'user' });
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
          
          .badge-admin { background-color: #e7e7ff; color: #696cff; padding: 5px 10px; border-radius: 5px; font-weight: 600; font-size: 0.75rem; }
          .badge-user { background-color: #e8fadf; color: #71dd37; padding: 5px 10px; border-radius: 5px; font-weight: 600; font-size: 0.75rem; }
        `}
      </style>

      {/* MODAL KONFIRMASI HAPUS */}
      {showDeleteModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-box-custom">
            <div className="text-danger mb-3"><i className="bi bi-exclamation-circle" style={{ fontSize: '3.5rem' }}></i></div>
            <h5 className="fw-bold" style={{ color: '#566a7f' }}>Hapus Akun Pengguna?</h5>
            <p className="text-muted mb-4">Menghapus <strong>{userToDelete?.name}</strong>? Data akan hilang permanen.</p>
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
            <h4 className="fw-bold m-0">Kelola Pengguna (Users)</h4>
            <button className="btn btn-sneat fw-bold shadow-sm" onClick={showForm ? resetForm : () => setShowForm(true)}>
              <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
              {showForm ? 'Batal' : 'Tambah Pengguna'}
            </button>
          </div>

          {showForm && (
            <div className="card sneat-card mb-4 p-4 border-top border-primary border-4">
              <h5 className="fw-bold mb-4">{editingId ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Nama Lengkap</label>
                    <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Alamat Email</label>
                    <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Nomor Telepon (Phone)</label>
                    <input type="text" className="form-control" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>

                  {!editingId && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Password Sementara</label>
                      <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required={!editingId} />
                    </div>
                  )}

                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold">Hak Akses (Role)</label>
                    <select className="form-select" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                      <option value="user">Pelanggan (User)</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-sneat px-4 mt-2">
                  <i className="bi bi-save me-2"></i> {editingId ? 'Simpan Perubahan' : 'Buat Akun'}
                </button>
              </form>
            </div>
          )}

          <div className="card sneat-card overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover table-custom mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">Nama Pengguna</th>
                    <th>Kontak</th>
                    <th>Hak Akses</th>
                    <th className="text-center pe-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="text-center py-4">Memuat data...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">Belum ada data pengguna.</td></tr>
                  ) : (
                    users.map((usr) => (
                      <tr key={usr.id}>
                        <td className="ps-4 fw-bold text-dark">{usr.name}</td>
                        <td className="text-muted">
                          <i className="bi bi-envelope me-1"></i> {usr.email} <br/>
                          <i className="bi bi-telephone me-1"></i> {usr.phone || '-'}
                        </td>
                        <td>
                          <span className={usr.role === 'admin' ? 'badge-admin' : 'badge-user'}>
                            {usr.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="text-center pe-4">
                          <button onClick={() => handleEditClick(usr)} className="btn btn-sm btn-outline-primary me-2"><i className="bi bi-pencil"></i></button>
                          <button onClick={() => confirmDelete(usr)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
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

export default ManageUsers;