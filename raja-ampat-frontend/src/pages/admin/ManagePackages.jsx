import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManagePackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // TAMBAHAN: is_available di state
  const [formData, setFormData] = useState({
    title: '', price: '', duration: '', image_url: '', description: '', is_available: true
  });

  const [itineraries, setItineraries] = useState([
    { destination_id: '', activity: '' } 
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const token = localStorage.getItem('adminToken');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resDest = await axios.get('http://localhost:5000/api/destinations', config);
      const destData = resDest.data.data || resDest.data || [];
      setDestinations(Array.isArray(destData) ? destData : []);
    } catch (error) {
      console.error("Gagal ambil destinasi:", error);
    }

    try {
      const resPkg = await axios.get('http://localhost:5000/api/tour_packages', config);
      const pkgData = resPkg.data.data || resPkg.data || [];
      setPackages(Array.isArray(pkgData) ? pkgData : []);
    } catch (error) {
      console.error("Gagal ambil paket:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    fetchData();
  }, [navigate]);

  const handleAddDay = () => setItineraries([...itineraries, { destination_id: '', activity: '' }]);
  const handleRemoveDay = (index) => setItineraries(itineraries.filter((_, i) => i !== index));

  const handleItineraryChange = (index, field, value) => {
    const newItin = [...itineraries];
    newItin[index][field] = value;
    setItineraries(newItin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        price: formData.price,
        duration: formData.duration,
        image_url: formData.image_url,
        description: formData.description,
        is_available: formData.is_available, // TAMBAHAN: Kirim status ke backend
        itinerary: itineraries.map((it, index) => ({
          destination_id: it.destination_id ? parseInt(it.destination_id) : null, 
          day_number: index + 1,
          activity: it.activity
        }))
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/tour_packages/${editingId}`, payload, config);
        alert('Paket & Jadwal berhasil diperbarui!');
      } else {
        await axios.post('http://localhost:5000/api/tour_packages', payload, config);
        alert('Paket & Jadwal berhasil ditambahkan!');
      }
      resetForm();
      fetchData();
    } catch (error) {
      alert(`Gagal menyimpan: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditClick = (pkg) => {
    setFormData({
      title: pkg.title, 
      price: pkg.price, 
      duration: pkg.duration, 
      image_url: pkg.image_url || '',
      description: pkg.description || '',
      is_available: pkg.is_available !== false // Pastikan defaultnya true jika null
    });

    if (pkg.itinerary_details && pkg.itinerary_details.length > 0) {
      const loadedItineraries = pkg.itinerary_details.map(it => ({
        destination_id: it.destination_id || '',
        activity: it.activity || ''
      }));
      setItineraries(loadedItineraries);
    } else {
      setItineraries([{ destination_id: '', activity: '' }]);
    }

    setEditingId(pkg.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!packageToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/tour_packages/${packageToDelete.id}`, config);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      fetchData();
    } catch (error) {
      alert("Gagal menghapus paket.");
    }
  };

  const resetForm = () => {
    setFormData({ title: '', price: '', duration: '', image_url: '', description: '', is_available: true });
    setItineraries([{ destination_id: '', activity: '' }]);
    setEditingId(null);
    setShowForm(false);
  };

  const theme = { bgApp: '#f5f5f9', primary: '#696cff', cardShadow: '0 2px 6px 0 rgba(67, 89, 113, 0.12)' };

  return (
    <>
      <style>
        {`
          .sneat-main { margin-left: 260px; padding: 20px; min-height: 100vh; background-color: ${theme.bgApp}; }
          .sneat-card { background: white; border-radius: 8px; border: none; box-shadow: ${theme.cardShadow}; }
          .btn-sneat { background-color: ${theme.primary}; color: white; border: none; }
          .btn-sneat:hover { background-color: #5f61e6; color: white; }
          .modal-backdrop-custom { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(67, 89, 113, 0.5); backdrop-filter: blur(2px); display: flex; justify-content: center; align-items: center; z-index: 1050; }
          .modal-box-custom { background: white; padding: 30px; border-radius: 12px; width: 400px; text-align: center; animation: slideDown 0.3s ease-out; }
          @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .itinerary-box { background-color: #f8f9fa; border: 1px dashed #d9dee3; border-radius: 8px; transition: all 0.3s; }
          .itinerary-box:hover { border-color: ${theme.primary}; }
          .card-title-small { font-size: 0.95rem; font-weight: 700; color: #566a7f; margin-bottom: 5px; }
          .price-small { font-size: 1.05rem; font-weight: 800; color: ${theme.primary}; }
        `}
      </style>

      {showDeleteModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-box-custom">
            <div className="text-danger mb-3"><i className="bi bi-exclamation-circle" style={{ fontSize: '3.5rem' }}></i></div>
            <h5 className="fw-bold" style={{ color: '#566a7f' }}>Hapus Paket Tour?</h5>
            <p className="text-muted mb-4 small">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-sm btn-outline-secondary px-3" onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button className="btn btn-sm btn-danger px-3" onClick={executeDelete}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <Sidebar />
        <main className="sneat-main">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold m-0" style={{ color: '#566a7f' }}>Kelola Paket Tour</h4>
            <button className="btn btn-sneat fw-bold shadow-sm" onClick={showForm ? resetForm : () => setShowForm(true)}>
              <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
              {showForm ? 'Batal' : 'Tambah Paket'}
            </button>
          </div>

          {showForm && (
            <div className="card sneat-card mb-4 p-4 border-top border-primary border-4">
              <h5 className="fw-bold mb-4">{editingId ? 'Edit Paket Tour' : 'Form Paket Tour Baru'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Nama Paket</label>
                    <input type="text" className="form-control form-control-sm" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-semibold">Harga (Rp)</label>
                    <input type="number" className="form-control form-control-sm" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label fw-semibold">Durasi</label>
                    <input type="text" className="form-control form-control-sm" placeholder="3 Hari 2 Malam" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required />
                  </div>
                  
                  <div className="col-md-8 mb-3">
                    <label className="form-label fw-semibold">Link Foto Utama</label>
                    <input type="url" className="form-control form-control-sm" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
                  </div>

                  {/* TAMBAHAN: SAKLAR (SWITCH) STATUS KETERSEDIAAN */}
                  <div className="col-md-4 mb-3 d-flex align-items-end">
                    <div className="form-check form-switch fs-5 mb-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="statusSwitch" 
                        checked={formData.is_available} 
                        onChange={(e) => setFormData({...formData, is_available: e.target.checked})} 
                      />
                      <label className="form-check-label fw-bold ms-2" htmlFor="statusSwitch" style={{ fontSize: '1rem' }}>
                        {formData.is_available ? <span className="text-success">Tersedia</span> : <span className="text-danger">Tidak Tersedia</span>}
                      </label>
                    </div>
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold">Deskripsi / Fasilitas</label>
                    <textarea className="form-control form-control-sm" rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                  </div>
                  <div className="col-12 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                      <label className="form-label fw-bold m-0" style={{ color: theme.primary }}>Jadwal Perjalanan</label>
                      <button type="button" className="btn btn-sm btn-outline-primary fw-bold" onClick={handleAddDay}><i className="bi bi-plus-circle me-1"></i> Tambah Hari</button>
                    </div>
                    {itineraries.map((item, index) => (
                      <div key={index} className="itinerary-box p-3 mb-3 position-relative">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-primary" style={{ fontSize: '0.7rem' }}>Hari ke-{index + 1}</span>
                          {itineraries.length > 1 && <button type="button" className="btn btn-sm text-danger p-0" onClick={() => handleRemoveDay(index)}><i className="bi bi-trash fs-6"></i></button>}
                        </div>
                        <div className="row g-2">
                          <div className="col-md-4">
                            <select className="form-select form-select-sm" value={item.destination_id} onChange={(e) => handleItineraryChange(index, 'destination_id', e.target.value)} required>
                              <option value="">-- Pilih Destinasi --</option>
                              {destinations.map(dest => <option key={dest.id} value={dest.id}>{dest.name || dest.title}</option>)}
                            </select>
                          </div>
                          <div className="col-md-8">
                            <input type="text" className="form-control form-select-sm" placeholder="Kegiatan..." value={item.activity} onChange={(e) => handleItineraryChange(index, 'activity', e.target.value)} required />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-sneat px-4 py-2 fw-bold w-100"><i className="bi bi-save me-2"></i> {editingId ? 'Simpan Perubahan' : 'Simpan Paket'}</button>
              </form>
            </div>
          )}

          <div className="row g-3">
            {isLoading ? (
              <div className="col-12 text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : packages.length === 0 ? (
              <div className="col-12 text-center py-5 text-muted">Belum ada paket tour.</div>
            ) : (
              packages.map((pkg) => (
                <div key={pkg.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                  <div 
                    className={`card sneat-card h-100 overflow-hidden shadow-sm border ${!pkg.is_available ? 'opacity-75' : ''}`} 
                    style={{ transition: 'transform 0.2s ease-in-out', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="position-relative">
                      <img 
                        src={pkg.image_url} 
                        className="card-img-top" 
                        alt={pkg.title} 
                        style={{ height: '160px', objectFit: 'cover', filter: pkg.is_available === false ? 'grayscale(80%)' : 'none' }} 
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x160?text=No+Image'} 
                      />
                      {/* TAMBAHAN: LABEL STATUS DI ATAS FOTO */}
                      <div className="position-absolute top-0 start-0 w-100 p-2 d-flex justify-content-between">
                        <span className={`badge ${pkg.is_available === false ? 'bg-danger' : 'bg-success'} shadow-sm`} style={{ fontSize: '0.65rem' }}>
                          {pkg.is_available === false ? 'Tidak Tersedia' : 'Tersedia'}
                        </span>
                        <span className="badge bg-white text-dark shadow-sm" style={{ fontSize: '0.65rem' }}>{pkg.duration}</span>
                      </div>
                    </div>
                    <div className="card-body p-3">
                      <div className="card-title-small text-truncate" title={pkg.title}>{pkg.title}</div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-geo-alt-fill text-danger me-1" style={{ fontSize: '0.75rem' }}></i>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>{(pkg.itinerary_details || []).length} Destinasi</small>
                      </div>
                      <div className="price-small">Rp {parseInt(pkg.price).toLocaleString('id-ID')}</div>
                    </div>
                    <div className="card-footer bg-white border-top-0 d-flex gap-2 p-3 pt-0">
                      <button onClick={() => handleEditClick(pkg)} className="btn btn-sm btn-outline-primary flex-grow-1"><i className="bi bi-pencil"></i></button>
                      <button onClick={() => confirmDelete(pkg)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ManagePackages;