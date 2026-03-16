const express = require('express');
const router = express.Router();
const { getBlogs, getSingleBlog } = require('../controllers/blogController');

router.get('/', getBlogs);
router.get('/:id', getSingleBlog);

module.exports = router;