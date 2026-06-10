// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    // Prioritaskan DATABASE_URL bawaan dari Railway
    connectionString: process.env.DATABASE_URL,
    
    // Fallback: Jika tidak ada DATABASE_URL (saat dijalankan di laptop lokal)
    ...(process.env.DATABASE_URL ? {} : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    })
});

module.exports = pool;