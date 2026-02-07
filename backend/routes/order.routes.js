const express = require("express");
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
// get orders
router.get("/orders", getOrders);
// initialize payment (Paystack)
router.post("/initialize-payment", initializePayment);
// verify payment (Paystack)
router.post("/verify-payment", verifyPayment);
// save Order
router.post("/saveOrder", addOrder);
// update status
router.patch("/update-status/:id", updateOrderStatus);
// single order (must be last to avoid catching other routes)
router.get("/:id", getSingleOrder);

module.exports = router;
