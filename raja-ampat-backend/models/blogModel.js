const pool = require('../config/db');

const getAllBlogs = async () => {
    const result = await pool.query('SELECT * FROM blogs ORDER BY id DESC');
    return result.rows;
};

const createBlog = async (title, content, image_url, author) => {
    // Sesuaikan nama kolom jika di pgAdmin kamu berbeda!
    const result = await pool.query(
        'INSERT INTO blogs (title, content, image_url, author) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, content, image_url, author]
    );
    return result.rows[0];
};

const updateBlog = async (id, title, content, image_url, author) => {
    const result = await pool.query(
        'UPDATE blogs SET title = $1, content = $2, image_url = $3, author = $4 WHERE id = $5 RETURNING *',
        [title, content, image_url, author, id]
    );
    return result.rows[0];
};

const deleteBlog = async (id) => {
    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { getAllBlogs, createBlog, updateBlog, deleteBlog };