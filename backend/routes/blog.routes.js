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

// Support legacy slugs that contain a path prefix, such as "blog/post-name".
router.get('/*', (req, res, next) => {
  req.params.id = req.params[0];
  next();
}, blogController.getSingleBlog);

// update blog
router.patch('/edit/:id', blogController.updateBlog);

// delete blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
