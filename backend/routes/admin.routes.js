const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { authorizeRole, authorizePermission } = require("../middleware/authorization");
const {
  registerAdmin,
  loginAdmin,
  updateStaff,
  updateStaffStatus,
  changePassword,
  addStaff,
  getAllStaff,
  deleteStaff,
  getStaffById,
  forgetPassword,
  confirmAdminEmail,
  confirmAdminForgetPass,
  getAllUsers,
  getSingleUser,
  updateUserStatus,
  updateUser,
  getAllOrders,
  getDashboardStats,
  createDefaultAdmin,
} = require("../controller/admin.controller");
const {
  getAdminSettings,
  updateAdminSettings,
} = require("../controller/settings.controller");

//register a staff
router.post("/register", registerAdmin);

//login a admin
router.post("/login", loginAdmin);

//change password
router.patch("/change-password", verifyToken, changePassword);

// STAFF MANAGEMENT ROUTES (Super Admin only)
// Add new staff
router.post("/staff/add", verifyToken, authorizeRole("Super Admin"), addStaff);

// Get all staff
router.get("/staff/all", verifyToken, authorizeRole("Super Admin"), getAllStaff);

// Get staff by id
router.get("/staff/:id", verifyToken, authorizeRole("Super Admin"), getStaffById);

// Update staff
router.patch("/staff/:id", verifyToken, authorizeRole("Super Admin"), updateStaff);

// Update staff status (activate/deactivate)
router.patch("/staff/status/:id", verifyToken, authorizeRole("Super Admin"), updateStaffStatus);

// Delete staff
router.delete("/staff/:id", verifyToken, authorizeRole("Super Admin"), deleteStaff);

//forget-password
router.patch("/forget-password", forgetPassword);

//confirm-forget-password
router.patch("/confirm-forget-password", confirmAdminForgetPass);

// DASHBOARD
router.get("/dashboard/stats", verifyToken, getDashboardStats);

// USERS MANAGEMENT
router.get("/users/all", verifyToken, authorizePermission("users", "view"), getAllUsers);

router.get("/users/:id", verifyToken, authorizePermission("users", "view"), getSingleUser);

router.patch("/users/status/:id", verifyToken, authorizePermission("users", "edit"), updateUserStatus);

router.patch("/users/:id", verifyToken, authorizePermission("users", "edit"), updateUser);

// ORDERS
router.get("/orders/all", verifyToken, authorizePermission("orders", "view"), getAllOrders);

// create default admin (development only)
router.post("/create-default", createDefaultAdmin);

// SETTINGS ROUTES (Super Admin only)
router.get(
  "/settings",
  verifyToken,
  authorizeRole("Super Admin"),
  getAdminSettings
);
router.patch(
  "/settings",
  verifyToken,
  authorizeRole("Super Admin"),
  updateAdminSettings
);

module.exports = router;
