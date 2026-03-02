const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorization");
const {
  registerAdmin,
  loginAdmin,
  updateStaff,
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

//login a admin
router.patch("/change-password", changePassword);

//login a admin
router.post("/add", addStaff);

//login a admin
router.get("/all", getAllStaff);

//forget-password
router.patch("/forget-password", forgetPassword);

//forget-password
router.patch("/confirm-forget-password", confirmAdminForgetPass);

//get a staff
router.get("/get/:id", getStaffById);

// update a staff
router.patch("/update-stuff/:id", updateStaff);

//update staf status
// router.put("/update-status/:id", updatedStatus);

//delete a staff
router.delete("/:id", deleteStaff);

// get dashboard stats
router.get("/dashboard/stats", getDashboardStats);

// get all users
router.get("/users/all", getAllUsers);

// get single user
router.get("/users/:id", getSingleUser);

// update user status
router.patch("/users/status/:id", updateUserStatus);

// update user
router.patch("/users/:id", updateUser);

// get all orders
router.get("/orders/all", getAllOrders);

// create default admin (development only)
router.post("/create-default", createDefaultAdmin);

// settings routes
router.get(
  "/settings",
  verifyToken,
  authorize("Admin", "Super Admin", "Manager", "CEO"),
  getAdminSettings
);
router.patch(
  "/settings",
  verifyToken,
  authorize("Admin", "Super Admin", "Manager", "CEO"),
  updateAdminSettings
);

module.exports = router;
