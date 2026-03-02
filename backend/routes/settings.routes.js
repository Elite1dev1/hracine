const express = require("express");
const router = express.Router();
const { getPublicSettings } = require("../controller/settings.controller");

// Public route to get settings (for frontend to fetch free shipping threshold)
router.get("/", getPublicSettings);

module.exports = router;
