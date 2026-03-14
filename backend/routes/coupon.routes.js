const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { authorizePermission } = require('../middleware/authorization');
const {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require('../controller/coupon.controller');

//add a coupon (requires store manager or super admin)
router.post('/add', verifyToken, authorizePermission("coupons", "create"), addCoupon);

//add multiple coupon (requires store manager or super admin)
router.post('/all', verifyToken, authorizePermission("coupons", "create"), addAllCoupon);

//get all coupon
router.get('/', getAllCoupons);

//get a coupon
router.get('/:id', getCouponById);

//update a coupon (requires store manager or super admin)
router.patch('/:id', verifyToken, authorizePermission("coupons", "edit"), updateCoupon);

//delete a coupon (requires store manager or super admin)
router.delete('/:id', verifyToken, authorizePermission("coupons", "delete"), deleteCoupon);
module.exports = router;