const pool = require('../config/db');

// 1. Ambil Semua Paket (Otomatis menarik seluruh kolom termasuk included & excluded karena memakai p.*)
const getAllPackages = async () => {
    const query = `
        SELECT p.*, 
               COALESCE(
                   json_agg(
                       json_build_object(
                           'day_number', i.day_number,
                           'activity', i.activity,
                           'destination_id', d.id,
                           'dest_name', d.name,
                           'dest_image', d.image_url
                       ) ORDER BY i.day_number
                   ) FILTER (WHERE i.id IS NOT NULL), '[]'
               ) AS itinerary_details
        FROM tour_packages p
        LEFT JOIN itinerary i ON p.id = i.package_id
        LEFT JOIN destinations d ON i.destination_id = d.id
        GROUP BY p.id
        ORDER BY p.id DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

// 2. Buat Paket (Menambahkan kolom included ($9) dan excluded ($10) ke dalam Query)
const createPackage = async (title, price, duration, image_url, description, is_available, is_featured, category, itineraryArray, included, excluded) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Modifikasi query INSERT untuk memasukkan kolom baru
        const pkgRes = await client.query(
            `INSERT INTO tour_packages 
            (title, price, duration, image_url, description, is_available, is_featured, category, included, excluded) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [title, price, duration, image_url, description, is_available, is_featured, category, included, excluded]
        );
        const newPackage = pkgRes.rows[0];

        // Memasukkan data jadwal perjalanan (itinerary)
        if (itineraryArray && itineraryArray.length > 0) {
            for (let i = 0; i < itineraryArray.length; i++) {
                const item = itineraryArray[i];
                await client.query(
                    'INSERT INTO itinerary (package_id, destination_id, day_number, activity) VALUES ($1, $2, $3, $4)',
                    [newPackage.id, item.destination_id, item.day_number || (i + 1), item.activity]
                );
            }
        }

        await client.query('COMMIT');
        return newPackage;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// 3. Update Paket (Menambahkan kolom included ($9) dan excluded ($10), serta memindahkan ID ke posisi ($11))
const updatePackage = async (id, title, price, duration, image_url, description, is_available, is_featured, category, itineraryArray, included, excluded) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Modifikasi query UPDATE untuk memperbarui kolom fasilitas terpisah
        const pkgRes = await client.query(
            `UPDATE tour_packages 
            SET title = $1, price = $2, duration = $3, image_url = $4, description = $5, is_available = $6, is_featured = $7, category = $8, included = $9, excluded = $10 
            WHERE id = $11 RETURNING *`,
            [title, price, duration, image_url, description, is_available, is_featured, category, included, excluded, id]
        );

        // Hapus itinerary lama lalu masukkan kembali yang baru untuk sinkronisasi
        await client.query('DELETE FROM itinerary WHERE package_id = $1', [id]);

        if (itineraryArray && itineraryArray.length > 0) {
            for (let i = 0; i < itineraryArray.length; i++) {
                const item = itineraryArray[i];
                await client.query(
                    'INSERT INTO itinerary (package_id, destination_id, day_number, activity) VALUES ($1, $2, $3, $4)',
                    [id, item.destination_id, item.day_number || (i + 1), item.activity]
                );
            }
        }

        await client.query('COMMIT');
        return pkgRes.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const deletePackage = async (id) => {
    const result = await pool.query('DELETE FROM tour_packages WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { getAllPackages, createPackage, updatePackage, deletePackage };