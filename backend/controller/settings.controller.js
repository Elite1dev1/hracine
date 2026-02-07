const Settings = require("../model/Settings");

// Get settings
const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// Update settings
const updateSettings = async (req, res, next) => {
  try {
    const { freeShippingThreshold } = req.body;

    if (!freeShippingThreshold || freeShippingThreshold < 0) {
      return res.status(400).json({
        success: false,
        message: "Free shipping threshold must be a positive number",
      });
    }

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({ freeShippingThreshold });
    } else {
      settings.freeShippingThreshold = freeShippingThreshold;
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
