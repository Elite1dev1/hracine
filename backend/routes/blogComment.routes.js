const express = require('express');
const router = express.Router();
const blogCommentController = require('../controller/blogComment.controller');
const verifyToken = require('../middleware/verifyToken');

// add blog comment (requires authentication)
router.post('/add', verifyToken, blogCommentController.addBlogComment);

// get comments by blog ID (public)
router.get('/blog/:blogId', blogCommentController.getBlogComments);

// delete blog comment (requires authentication - user can only delete their own)
router.delete('/:id', verifyToken, blogCommentController.deleteBlogComment);

module.exports = router;
