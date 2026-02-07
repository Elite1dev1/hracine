const express = require("express");
const router = express.Router();
const { getSettings } = require("../controller/settings.controller");

// Public route to get settings (for frontend to fetch free shipping threshold)
router.get("/", getSettings);

module.exports = router;
