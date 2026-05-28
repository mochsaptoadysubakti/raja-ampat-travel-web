const midtransClient = require('midtrans-client');
const db = require('../config/db'); // Pastikan path database ini benar

const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Fungsi khusus untuk menerima Webhook dari Midtrans
const handleNotification = async (req, res) => {
    try {
        const notificationJson = req.body;
        
        // Midtrans SDK memverifikasi keaslian notifikasi ini
        const statusResponse = await snap.transaction.notification(notificationJson);

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const paymentType = statusResponse.payment_type; // Ambil metode pembayaran

        console.log(`Notifikasi masuk: Order ID ${orderId}, Status ${transactionStatus}`);

        let newStatus = 'pending';

        // Tentukan status baru berdasarkan laporan Midtrans
        if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
            newStatus = 'success';
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            newStatus = 'failed';
        }

        // Update database PostgreSQL kamu
        const updateQuery = `
            UPDATE bookings 
            SET status = $1, payment_type = $2 
            WHERE midtrans_order_id = $3
        `;
        await db.query(updateQuery, [newStatus, paymentType, orderId]);

        // WAJIB balas 200 OK ke Midtrans agar tidak dikirimi notifikasi berulang-ulang
        res.status(200).json({ status: 'ok' });

    } catch (error) {
        console.error("Error webhook Midtrans:", error);
        res.status(500).json({ status: 'error', message: 'Gagal memproses notifikasi' });
    }
};

module.exports = { 
    handleNotification 
};