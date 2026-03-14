const express = require('express');
const router = express.Router();
// internal
const categoryController = require('../controller/category.controller');
const verifyToken = require('../middleware/verifyToken');
const { authorizePermission } = require('../middleware/authorization');

// get
router.get('/get/:id', categoryController.getSingleCategory);
// add (requires store manager or super admin)
router.post('/add', verifyToken, authorizePermission("categories", "create"), categoryController.addCategory);
// add All Category (requires store manager or super admin)
router.post('/add-all', verifyToken, authorizePermission("categories", "create"), categoryController.addAllCategory);
// get all Category
router.get('/all', categoryController.getAllCategory);
// get Product Type Category
router.get('/show/:type', categoryController.getProductTypeCategory);
// get Show Category
router.get('/show', categoryController.getShowCategory);
// delete category (requires store manager or super admin)
router.delete('/delete/:id', verifyToken, authorizePermission("categories", "delete"), categoryController.deleteCategory);
// edit category (requires store manager or super admin)
router.patch('/edit/:id', verifyToken, authorizePermission("categories", "edit"), categoryController.updateCategory);

module.exports = router;