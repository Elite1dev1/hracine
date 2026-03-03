const express = require("express");
const router = express.Router();
const consultationController = require("../controller/consultation.controller");
const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorization");

// Admin routes - require authentication and any admin role (must come before POST to avoid conflicts)
router.get("/", verifyToken, authorize("Admin", "Super Admin", "Manager", "CEO"), consultationController.getAllConsultations);
router.get("/:id", verifyToken, authorize("Admin", "Super Admin", "Manager", "CEO"), consultationController.getConsultation);
router.patch("/:id/status", verifyToken, authorize("Admin", "Super Admin", "Manager", "CEO"), consultationController.updateConsultationStatus);
router.delete("/:id", verifyToken, authorize("Admin", "Super Admin", "Manager", "CEO"), consultationController.deleteConsultation);

// Public route - anyone can book a consultation (must come after specific routes)
router.post("/", consultationController.createConsultation);

module.exports = router;
