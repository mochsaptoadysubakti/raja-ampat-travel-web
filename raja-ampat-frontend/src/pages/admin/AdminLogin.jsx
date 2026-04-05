import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: email,
        password: password
      });
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        alert('Akses Diterima! Selamat Datang, ' + response.data.user.name);
        
        // FUNGSI INI SUDAH DIHIDUPKAN KEMBALI
        navigate('/admin/dashboard'); 
      }
    } catch (error) {
      alert(`Gagal: ${error.response?.data?.message || 'Email atau password salah'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Import Font Poppins dari Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
          
          .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
          }

          .form-control-glass {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: white !important;
            font-weight: 300;
          }

          .form-control-glass::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
          }

          .btn-login {
            background: #e67e22;
            border: none;
            transition: all 0.3s ease;
          }

          .btn-login:hover {
            background: #d35400;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(230, 126, 34, 0.4);
          }
        `}
      </style>

      <div className="d-flex align-items-center justify-content-center vh-100" 
           style={{ 
             backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             fontFamily: "'Poppins', sans-serif" 
           }}>

        <div className="card glass-card shadow-lg" style={{ width: '400px' }}>
          <div className="card-body p-5 text-white">
            
            <div className="text-center mb-5">
              <h2 className="fw-bold m-0" style={{ letterSpacing: '3px' }}>
                <span style={{ color: '#e67e22' }}>AMPATH</span>EIA
              </h2>
              <div style={{ height: '2px', width: '50px', background: '#e67e22', margin: '10px auto' }}></div>
              <p className="small text-uppercase fw-light mt-2" style={{ letterSpacing: '2px', opacity: 0.8 }}>
                Secure Access
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label small fw-semibold text-uppercase opacity-75 mb-2">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-0 text-white opacity-50">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control form-control-glass shadow-none p-3"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>
              
              <div className="mb-5">
                <label className="form-label small fw-semibold text-uppercase opacity-75 mb-2">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-0 text-white opacity-50">
                    <i className="bi bi-shield-lock"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-glass shadow-none p-3"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderRadius: '12px 0 0 12px' }}
                  />
                  <button 
                    type="button" 
                    className="btn border-0 text-white opacity-50"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0 12px 12px 0' }}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-login btn-lg w-100 fw-bold text-white py-3 shadow" 
                style={{ borderRadius: '12px', fontSize: '0.9rem', letterSpacing: '1px' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : 'AUTHENTICATE'}
              </button>
            </form>

            <div className="text-center mt-5">
              <p className="extra-small opacity-50 mb-0" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                &copy; 2026 AMPATHEIA RAJA AMPAT
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;