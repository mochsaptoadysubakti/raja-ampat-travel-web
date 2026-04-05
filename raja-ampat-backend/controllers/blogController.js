const Blog = require('../models/blogModel');

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.getAllBlogs();
        res.status(200).json({ data: blogs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addBlog = async (req, res) => {
    const { title, content, image_url, author } = req.body;
    try {
        const newBlog = await Blog.createBlog(title, content, image_url, author);
        res.status(201).json({ status: "success", data: newBlog, message: "Artikel berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBlog = async (req, res) => {
    const { title, content, image_url, author } = req.body;
    try {
        const updatedBlog = await Blog.updateBlog(req.params.id, title, content, image_url, author);
        if (!updatedBlog) return res.status(404).json({ message: "Artikel tidak ditemukan" });
        res.status(200).json({ status: "success", data: updatedBlog, message: "Artikel berhasil diubah!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.deleteBlog(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: "Artikel tidak ditemukan" });
        res.status(200).json({ status: "success", message: "Artikel berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getBlogs, addBlog, updateBlog, deleteBlog };