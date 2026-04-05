const express = require('express');
const router = express.Router();
const { getBlogs, addBlog, updateBlog, deleteBlog } = require('../controllers/blogController');

router.get('/', getBlogs);
router.post('/', addBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;