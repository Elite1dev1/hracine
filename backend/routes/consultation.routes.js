const express = require("express");
const router = express.Router();
const consultationController = require("../controller/consultation.controller");
const verifyToken = require("../middleware/verifyToken");
const { authorizePermission } = require("../middleware/authorization");

// Admin routes - require authentication and proper permissions
router.get("/", verifyToken, authorizePermission("consultations", "view"), consultationController.getAllConsultations);
router.get("/:id", verifyToken, authorizePermission("consultations", "view"), consultationController.getConsultation);
router.patch("/:id/status", verifyToken, authorizePermission("consultations", "edit"), consultationController.updateConsultationStatus);
router.delete("/:id", verifyToken, authorizePermission("consultations", "delete"), consultationController.deleteConsultation);

// Public route - anyone can book a consultation (must come after specific routes)
router.post("/", consultationController.createConsultation);

module.exports = router;
