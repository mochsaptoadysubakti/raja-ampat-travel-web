import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchBlogData = async () => {
            setLoading(true);
            try {
                // Pastikan endpoint backend Anda benar
                const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
                
                // Menyesuaikan dengan respon API Anda: { "data": {...} }
                const data = res.data?.data || res.data;
                setBlog(data);
            } catch (error) {
                console.error("Gagal memuat artikel:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBlogData();
    }, [id]);

    if (loading) return <div className="text-center mt-5">Memuat artikel...</div>;
    if (!blog) return <div className="text-center mt-5">Artikel tidak ditemukan.</div>;

    // --- DATA DARI BACKEND ---
    // Pastikan key-nya sesuai: title, content, image_url, author
    const title = blog.title || "Tanpa Judul";
    const content = blog.content || "Konten kosong.";
    const author = blog.author || "Admin";
    const coverImage = blog.image_url || "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2b8a0d5b-4896-4b25-83f8-d93c96c26e77";

    return (
        <div className="container py-5">
            <Link to="/blog" className="btn btn-outline-secondary mb-3">← Kembali</Link>
            <img src={coverImage} className="img-fluid rounded mb-4" alt={title} style={{maxHeight: '400px', width: '100%', objectFit: 'cover'}} />
            <h1 className="fw-bold">{title}</h1>
            <p className="text-muted">Ditulis oleh: {author}</p>
            <hr />
            <div className="mt-4" style={{ whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
                {content}
            </div>
        </div>
    );
}