const express = require('express');
const router = express.Router();
// internal
const brandController = require('../controller/brand.controller');
const verifyToken = require('../middleware/verifyToken');
const { authorizePermission } = require('../middleware/authorization');

// add Brand (requires store manager or super admin)
router.post('/add', verifyToken, authorizePermission("brands", "create"), brandController.addBrand);
// add All Brand (requires store manager or super admin)
router.post('/add-all', verifyToken, authorizePermission("brands", "create"), brandController.addAllBrand);
// get Active Brands
router.get('/active', brandController.getActiveBrands);
// get all Brands
router.get('/all', brandController.getAllBrands);
// delete brand (requires store manager or super admin)
router.delete('/delete/:id', verifyToken, authorizePermission("brands", "delete"), brandController.deleteBrand);
// get single
router.get('/get/:id', brandController.getSingleBrand);
// edit brand (requires store manager or super admin)
router.patch('/edit/:id', verifyToken, authorizePermission("brands", "edit"), brandController.updateBrand);

module.exports = router;