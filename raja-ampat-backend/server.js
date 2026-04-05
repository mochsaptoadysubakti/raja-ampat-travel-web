const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Mengimpor semua routes
const destinationRoutes = require('./routes/destinationRoutes');
const tourPackageRoutes = require('./routes/tourPackageRoutes'); // File routes yang kita edit tadi
const userRoutes = require('./routes/userRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Agar bisa menerima request body berupa JSON

// --- FITUR DEBUGGER ANTI-CRASH ---
const safeRoute = (routeName, routeModule) => {
    if (typeof routeModule !== 'function') {
        console.log(`\n❌ ERROR DITEMUKAN PADA: ${routeName}`);
        console.log(`   Penyebab: File di dalam folder 'routes' ini kemungkinan masih kosong,`);
        console.log(`   atau kamu lupa menambahkan "module.exports = router;" di baris paling bawah.`);
        return express.Router(); 
    }
    return routeModule;
};
// ---------------------------------

// Mendaftarkan Routes API
app.use('/api/destinations', safeRoute('destinationRoutes', destinationRoutes));

// SINKRONISASI: Kita pakai underscore '_' agar cocok dengan pemanggilan di React (ManagePackages.jsx)
app.use('/api/tour_packages', safeRoute('tourPackageRoutes', tourPackageRoutes));

app.use('/api/users', safeRoute('userRoutes', userRoutes));
app.use('/api/itinerary', safeRoute('itineraryRoutes', itineraryRoutes));
app.use('/api/bookings', safeRoute('bookingRoutes', bookingRoutes));
app.use('/api/reviews', safeRoute('reviewRoutes', reviewRoutes));
app.use('/api/gallery', safeRoute('galleryRoutes', galleryRoutes));
app.use('/api/blogs', safeRoute('blogRoutes', blogRoutes));
app.use('/api/contacts', safeRoute('contactRoutes', contactRoutes));

// Route dasar untuk tes server
app.get('/', (req, res) => {
    res.send('API Raja Ampat Travel & Tourism Backend is Running!');
});

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
});