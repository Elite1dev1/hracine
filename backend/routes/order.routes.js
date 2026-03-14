const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { authorizePermission } = require("../middleware/authorization");
const {
  initializePayment,
  verifyPayment,
  addOrder,
  getOrders,
  updateOrderStatus,
  getSingleOrder,
} = require("../controller/order.controller");

// router
const router = express.Router();

// IMPORTANT: Specific routes must come before parameterized routes
// get orders (admin only - requires order manager or super admin)
router.get("/orders", verifyToken, authorizePermission("orders", "view"), getOrders);
// initialize payment (Paystack)
router.post("/initialize-payment", initializePayment);
// verify payment (Paystack)
router.post("/verify-payment", verifyPayment);
// save Order
router.post("/saveOrder", addOrder);
// update status (requires order manager or super admin)
router.patch("/update-status/:id", verifyToken, authorizePermission("orders", "edit"), updateOrderStatus);
router.get("/:id", getSingleOrder);

module.exports = router;
