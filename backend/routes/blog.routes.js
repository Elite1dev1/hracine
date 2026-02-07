const express = require('express');
const router = express.Router();
const blogController = require('../controller/blog.controller');

// add blog
router.post('/add', blogController.addBlog);

// get all blogs (admin)
router.get('/all', blogController.getAllBlogs);

// get published blogs (public)
router.get('/published', blogController.getPublishedBlogs);

// get single blog
router.get('/:id', blogController.getSingleBlog);

// update blog
router.patch('/edit/:id', blogController.updateBlog);

// delete blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
