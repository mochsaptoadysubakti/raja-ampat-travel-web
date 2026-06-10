import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebook, FaGlobe } from "react-icons/fa";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function BookingDetail() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation(); 

    // Tangkap data yang dikirim dari halaman Tour Detail (Mencegah layar kosong)
    const passedState = location.state || {};

    // State untuk data API (Otomatis terisi dari halaman sebelumnya jika ada)
    const [pkgDetail, setPkgDetail] = useState(passedState.packageData || null);
    const [user, setUser] = useState(null);

    // State untuk form input 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [totalPeople, setTotalPeople] = useState(passedState.totalPax || 1);
    const [bookingDate, setBookingDate] = useState(passedState.selectedDate || '');
    const [notes, setNotes] = useState('');
    
    // State UI
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // 1️⃣ EFEK UNTUK MEMUAT SCRIPT MIDTRANS (SANDBOX)
    useEffect(() => {
        // Gunakan URL Sandbox
        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js"; 
        
        // ✅ MENGAMBIL CLIENT KEY SECARA DINAMIS (DARI .ENV LOKAL ATAU RAILWAY)
        const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY; 

        const script = document.createElement("script");
        script.src = snapScript;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;

        if (!document.querySelector(`script[src="${snapScript}"]`)) {
            document.body.appendChild(script);
        }

        return () => {
            const existingScript = document.querySelector(`script[src="${snapScript}"]`);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    // 2️⃣ AMBIL DATA USER & PAKET SAAT KOMPONEN DIMUAT
    useEffect(() => {
        window.scrollTo(0, 0); 
        
        // Ambil data user yang sedang login
        const storedUser = localStorage.getItem('userData');
        if (storedUser && storedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setName(parsedUser.name || parsedUser.nama || '');
                setEmail(parsedUser.email || '');
                setPhone(parsedUser.phone || parsedUser.no_telp || ''); 
            } catch (e) {
                console.error("Gagal parsing user:", e);
            }
        }

        // Ambil detail paket dari API JIKA data dari halaman sebelumnya hilang/di-refresh
        if (!pkgDetail && id) {
            const fetchPackageDetail = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tour_packages/${id}`);
                    let data = response.data?.data || response.data;
                    if (Array.isArray(data)) data = data.length > 0 ? data[0] : null;
                    setPkgDetail(data);
                } catch (err) {
                    console.error("Gagal memuat detail paket dari API:", err);
                }
            };
            fetchPackageDetail();
        }
    }, [id, pkgDetail]);

    // Variabel Harga & Data Paket
    const basePrice = Number(pkgDetail?.price || pkgDetail?.harga || 0);
    const title = pkgDetail?.title || pkgDetail?.nama_paket || "Memuat paket...";
    const duration = pkgDetail?.duration || pkgDetail?.durasi || "-";
    const coverImage = pkgDetail?.image_url || pkgDetail?.image || pkgDetail?.foto || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4edd24f0-cd5b-4271-a94e-add9f4430f2a";

    // Kalkulasi Harga Dinamis
    const subTotal = basePrice * (Number(totalPeople) || 0);
    const tax = subTotal * 0.1; // Pajak 10%
    const grandTotal = subTotal + tax;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
    };

    // 3️⃣ FUNGSI SUBMIT PEMESANAN & MUNCULKAN MIDTRANS
    const handleConfirmBooking = async () => {
        if (!name || !email || !phone || !totalPeople || !bookingDate) {
            alert("Harap isi semua kolom yang wajib (*)!");
            return;
        }

        const activeUserId = user?.id || user?.id_user || user?.uid;
        
        if (!activeUserId) {
            alert("Sesi Anda tidak ditemukan. Silakan login kembali.");
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const payload = {
                user_id: activeUserId, 
                package_id: id || pkgDetail?.id,
                booking_date: bookingDate,
                total_people: Number(totalPeople),
                total_price: grandTotal,
                // Disinkronkan dengan kebutuhan backend Midtrans
                customer_name: name,
                customer_email: email,
                // Variabel bawaan sebelumnya
                user_name: name,       
                user_email: email,     
                user_phone: phone,     
                notes: notes           
            };

            // Simpan pesanan ke Database & dapatkan Snap Token dari backend
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, payload, config);
            const data = response.data;

            // 4️⃣ JIKA DAPAT TOKEN, TAMPILKAN POP-UP MIDTRANS
            if (data.token) {
                window.snap.pay(data.token, {
                    onSuccess: function (result) {
                        console.log("Pembayaran Sukses:", result);
                        setShowSuccessPopup(true);
                        setTimeout(() => {
                            setShowSuccessPopup(false);
                            navigate('/'); // Atau bisa diarahkan ke /riwayat-pesanan
                        }, 3000);
                    },
                    onPending: function (result) {
                        console.log("Menunggu Pembayaran:", result);
                        setShowSuccessPopup(true);
                        setTimeout(() => {
                            setShowSuccessPopup(false);
                            navigate('/'); 
                        }, 3000);
                    },
                    onError: function (result) {
                        console.error("Pembayaran Error:", result);
                        alert("Terjadi kesalahan saat memproses pembayaran Anda.");
                    },
                    onClose: function () {
                        alert("Anda menutup halaman pembayaran sebelum menyelesaikannya.");
                    }
                });
            } else {
                alert("Berhasil menyimpan pesanan, tetapi gagal mendapatkan token pembayaran.");
            }

        } catch (error) {
            console.error("Booking Error:", error);
            alert(error.response?.data?.error || "Terjadi kesalahan saat memproses pesanan Anda.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setUser(null);
        navigate('/login');
    };

    return (
        <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');
                    body { font-family: 'Inter', sans-serif; }
                    h1, h2, h3, h4, h5, .brand-text { font-family: 'Poppins', sans-serif; }
                    
                    .custom-input { border-radius: 10px; padding: 14px 18px; border: 1px solid #E5E7EB; background: #fff; width: 100%; transition: all 0.2s; }
                    .custom-input:focus { border-color: #FFB76C; box-shadow: 0 0 0 4px rgba(255, 183, 108, 0.15); outline: none; }
                    
                    .booking-card { background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.06); border: 1px solid #F3F4F6; position: sticky; top: 100px; }
                    .summary-img { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; }

                    /* --- CSS UNTUK POPUP SUKSES --- */
                    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; animation: fadeInModal 0.3s forwards; }
                    .modal-content-success { background-color: #fff; border-radius: 20px; max-width: 400px; width: 100%; padding: 40px 20px; text-align: center; transform: scale(0.9); animation: scaleUpModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
                    .success-icon { width: 70px; height: 70px; background-color: #D1FAE5; color: #10B981; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 2.5rem; margin: 0 auto 20px auto; }
                    
                    @keyframes fadeInModal { to { opacity: 1; } }
                    @keyframes scaleUpModal { to { transform: scale(1); } }

                    /*--footer--*/
                    .social-link {
                        transition: all 0.3s ease;
                        color: #000;
                    }
                    .social-link:hover {
                        transform: translateX(5px);
                        color: #ffffff !important;
                    }
                    .social-icon {
                        font-size: 28px;
                    }
                `}
            </style>

            {/* --- POPUP SUKSES PEMESANAN --- */}
            {showSuccessPopup && (
                <div className="modal-overlay">
                    <div className="modal-content-success">
                        <div className="success-icon">✓</div>
                        <h4 className="fw-bold text-dark mb-2">Pesanan Berhasil!</h4>
                        <p className="text-secondary small mb-0">
                            Terima kasih, pesanan Anda telah tersimpan dan sedang diproses. <br/><br/>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Mengalihkan ke beranda...</span>
                        </p>
                    </div>
                </div>
            )}

            {/* NAVBAR */}
            <nav className="navbar py-3 shadow-sm" style={{ backgroundColor: '#fff' }}>
                <div className="container-fluid px-4 px-lg-5 d-flex align-items-center">
                    <Link className="navbar-brand brand-text fs-3" style={{ color: '#111' }} to="/">
                        Ampatheia<span style={{ color: '#FFB76C' }}>.</span>
                    </Link>
                    <div className="ms-auto d-flex align-items-center gap-4">
                        <Link className="text-decoration-none fs-6 fw-medium text-dark" to="/tour-packages">Paket Wisata</Link>
                        {user ? (
                            <button onClick={handleLogout} className="btn btn-sm btn-outline-danger rounded-pill px-3">Keluar</button>
                        ) : (
                            <Link className="btn btn-sm btn-dark rounded-pill px-4" to="/login">Masuk</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* MAIN KONTEN */}
            <div className="container flex-grow-1" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
                <div className="mb-5 border-bottom pb-4">
                    <h2 className="fw-bold text-dark mb-1">Detail Pemesanan Anda</h2>
                    <p className="text-secondary mb-0">Silakan lengkapi data di bawah ini untuk melanjutkan pesanan.</p>
                </div>

                <div className="row g-5">
                    {/* KOLOM KIRI (FORM) */}
                    <div className="col-lg-7">
                        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border" style={{ borderColor: '#F3F4F6' }}>
                            <h4 className="fw-bold mb-4">Data Wisatawan</h4>
                            
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">Nama Lengkap*</label>
                                <input type="text" className="custom-input" placeholder="Masukkan nama sesuai KTP/Paspor" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="row g-4 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-secondary small">Alamat Email*</label>
                                    <input type="email" className="custom-input" placeholder="email@anda.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-secondary small">Nomor Telepon*</label>
                                    <input type="tel" className="custom-input" placeholder="+62 812-3456-7890" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>

                            <div className="row g-4 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-secondary small">Jumlah Tamu*</label>
                                    <input type="number" min="1" className="custom-input" placeholder="1" value={totalPeople} onChange={(e) => setTotalPeople(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-secondary small">Tanggal Keberangkatan*</label>
                                    <input type="date" className="custom-input" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="form-label fw-semibold text-secondary small">Catatan Khusus (Opsional)</label>
                                <textarea className="custom-input" rows="3" placeholder="Tuliskan kebutuhan alergi makanan, permintaan khusus, dll." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                            </div>

                            <div className="d-flex align-items-center mb-4">
                                <input type="checkbox" id="terms" className="form-check-input me-2" style={{ transform: 'scale(1.2)' }} defaultChecked />
                                <label htmlFor="terms" className="text-secondary small mb-0">Dengan mengkonfirmasi, Anda menyetujui syarat dan ketentuan layanan kami.</label>
                            </div>

                            <button className="btn w-100 py-3 rounded-pill fw-bold text-black fs-5 border-0 shadow-sm" style={{ backgroundColor: '#FFB76C', transition: 'all 0.3s' }} onClick={handleConfirmBooking} disabled={loading}>
                                {loading ? "Memproses..." : "Konfirmasi Pesanan"}
                            </button>
                        </div>
                    </div>

                    {/* KOLOM KANAN (RINGKASAN) */}
                    <div className="col-lg-5">
                        <div className="booking-card">
                            <h4 className="fw-bold mb-4">Ringkasan Pesanan</h4>
                            
                            <img src={coverImage} alt="Paket Tour" className="summary-img" />
                            
                            <h5 className="fw-bold text-dark mb-2">{title}</h5>
                            <p className="text-secondary mb-4 d-flex align-items-center gap-2">
                                <span>🕒 {duration}</span>
                            </p>

                            <div className="bg-light p-4 rounded-4 mb-4 border">
                                <div className="d-flex justify-content-between mb-3 text-secondary">
                                    <span>{formatRupiah(basePrice)} x {totalPeople || 0} Orang</span>
                                    <span className="fw-medium text-dark">{formatRupiah(subTotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 text-secondary">
                                    <span>Pajak (10%)</span>
                                    <span className="fw-medium text-dark">{formatRupiah(tax)}</span>
                                </div>
                                <hr className="my-3" style={{ borderColor: '#D1D5DB' }} />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold text-dark fs-5">Total Harga</span>
                                    <span className="fw-bold" style={{ color: '#FF6B2C', fontSize: '1.4rem' }}>{formatRupiah(grandTotal)}</span>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-3 small text-secondary">
                                <div className="d-flex align-items-start gap-2">
                                    <span className="text-success fw-bold">✓</span> Gratis pembatalan hingga 7 hari
                                </div>
                                <div className="d-flex align-items-start gap-2">
                                    <span className="text-success fw-bold">✓</span> Konfirmasi tiket instan
                                </div>
                                <div className="d-flex align-items-start gap-2">
                                    <span className="text-success fw-bold">✓</span> Proses pembayaran aman dan terenkripsi
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div style={{ position: 'relative', marginTop: '50px', width: '100%', overflow: 'hidden' }}>
                {/* SVG OMBAK (JANGAN DIUBAH) */}
                <svg
                viewBox="0 0 1440 120"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    marginBottom: '-1px'
                }}
                >
                <path
                    fill="#70E6D6"
                    d="M0,32L48,48C96,64,192,96,288,101.3C384,107,480,85,576,64C672,43,768,21,864,21.3C960,21,1056,43,1152,58.7C1248,75,1344,85,1392,90.7L1440,96L1440,121L0,121Z"
                ></path>
                </svg>

                {/* KONTEN FOOTER */}
                <footer className="pt-0 pb-2" style={{ backgroundColor: '#70E6D6' }}>
                <div className="container py-3">

                    <div className="row g-3 text-center justify-content-center">

                    {/* Kolom 1: Ampatheia */}
                    <div className="col-lg-4 px-lg-3">
                        <h4
                        className="fw-bold mb-2 text-dark"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                        Ampatheia
                        </h4>

                        <p
                        className="text-dark fw-medium mb-0"
                        style={{
                            lineHeight: '1.7',
                            fontSize: '0.9rem'
                        }}
                        >
                        Ampatheia hadir untuk memudahkan perjalanan wisata Anda ke Raja Ampat.
                        Temukan paket wisata lengkap, itinerary terstruktur, dan pemandu lokal
                        terpercaya dalam satu platform.
                        </p>
                    </div>

                    {/* Kolom 2: Tautan */}
                    <div className="col-lg-2 px-lg-3">
                        <h6
                        className="fw-bold mb-2 text-dark"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                        Tautan
                        </h6>

                        <ul
                        className="list-unstyled text-dark fw-medium mb-0"
                        style={{
                            lineHeight: '2',
                            fontSize: '0.9rem'
                        }}
                        >
                        <li>
                            <Link to="/" className="text-dark text-decoration-none nav-link-custom">
                            Beranda
                            </Link>
                        </li>

                        <li>
                            <Link
                            to="/tour-packages"
                            className="text-dark text-decoration-none nav-link-custom"
                            >
                            Paket Wisata
                            </Link>
                        </li>

                        <li>
                            <Link
                            to="#"
                            className="text-dark text-decoration-none nav-link-custom"
                            >
                            Blog
                            </Link>
                        </li>
                        </ul>
                    </div>

                    {/* Kolom 3: Hubungi Kami */}
                    <div className="col-lg-3 px-lg-3">
                        <h6
                        className="fw-bold mb-2 text-dark"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                        Hubungi Kami
                        </h6>

                        <ul
                        className="list-unstyled text-dark fw-medium mb-0"
                        style={{
                            lineHeight: '1.8',
                            fontSize: '0.9rem'
                        }}
                        >
                        <li>Email: info@ampatheia.com</li>
                        <li>Telepon: +62 812-3456-7890</li>
                        <li>Alamat: Jakarta, Indonesia</li>
                        </ul>
                    </div>

                    {/* Kolom 4: Ikuti Kami */}
                    <div className="col-lg-3 px-lg-3">
                        <h6
                        className="fw-bold mb-2 text-dark"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                        Ikuti Kami
                        </h6>

                        <div
                        className="d-flex flex-column align-items-center fw-medium mt-2"
                        style={{
                            gap: '12px',
                            fontSize: '0.9rem'
                        }}
                        >
                        <a
                            href="https://instagram.com/ampatheia.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link text-decoration-none d-flex align-items-center gap-2"
                        >
                            <FaInstagram size={22} />
                            <span>ampatheia.id</span>
                        </a>

                        <a
                            href="https://facebook.com/ampatheia.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link text-decoration-none d-flex align-items-center gap-2"
                        >
                            <FaFacebook size={22} />
                            <span>ampatheia.id</span>
                        </a>

                        <a
                            href="https://ampatheia.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link text-decoration-none d-flex align-items-center gap-2"
                        >
                            <FaGlobe size={22} />
                            <span>ampatheia.id</span>
                        </a>
                        </div>
                    </div>

                    </div>

                    <div className="text-center pt-2 mt-2">
                    <span
                        className="text-dark fw-medium"
                        style={{ fontSize: '0.85rem' }}
                    >
                        Copyright © 2026 Ampatheia. Hak cipta dilindungi
                    </span>
                    </div>

                </div>
                </footer>
            </div>
        </div>
    );
}