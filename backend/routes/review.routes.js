const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { authorizePermission } = require("../middleware/authorization");
const {
  addReview,
  adminListReviews,
  adminCreateReview,
  adminImportReviews,
  adminUpdateReview,
  adminDeleteReview,
} = require("../controller/review.controller");

router.post("/add", verifyToken, addReview);

router.get("/admin", verifyToken, authorizePermission("reviews", "view"), adminListReviews);
router.post("/admin", verifyToken, authorizePermission("reviews", "create"), adminCreateReview);
router.post("/admin/import", verifyToken, authorizePermission("reviews", "create"), adminImportReviews);
router.patch("/admin/:id", verifyToken, authorizePermission("reviews", "edit"), adminUpdateReview);
router.delete("/admin/:id", verifyToken, authorizePermission("reviews", "delete"), adminDeleteReview);

module.exports = router;
