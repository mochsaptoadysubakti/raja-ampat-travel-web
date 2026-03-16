const Blog = require('../models/blogModel');

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.getAllBlogs();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.getBlogById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getBlogs, getSingleBlog };