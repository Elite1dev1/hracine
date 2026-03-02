const Settings = require("../model/Settings");

const parseNonNegativeNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
};

const PAYSTACK_SECRET_KEY_REGEX = /^sk_(test|live)_[A-Za-z0-9]+$/;

const isSuperAdmin = (req) =>
  req?.user?.role?.toLowerCase() === "super admin";

const mapPublicSettings = (settings) => ({
  _id: settings._id,
  freeShippingThreshold: settings.freeShippingThreshold,
  todayDeliveryPrice: settings.todayDeliveryPrice,
  sevenDayDeliveryPrice: settings.sevenDayDeliveryPrice,
  createdAt: settings.createdAt,
  updatedAt: settings.updatedAt,
});

const mapAdminSettings = (settings, includePaystackSecrets = false) => ({
  ...mapPublicSettings(settings),
  paystackMode: settings.paystackMode || "test",
  ...(includePaystackSecrets
    ? {
        paystackTestApiKey: settings.paystackTestApiKey || "",
        paystackLiveApiKey: settings.paystackLiveApiKey || "",
      }
    : {}),
});

// Get public settings
const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.status(200).json({
      success: true,
      data: mapPublicSettings(settings),
    });
  } catch (error) {
    next(error);
  }
};

// Get admin settings
const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    const canViewPaystack = isSuperAdmin(req);
    res.status(200).json({
      success: true,
      data: mapAdminSettings(settings, canViewPaystack),
    });
  } catch (error) {
    next(error);
  }
};

// Update admin settings
const updateAdminSettings = async (req, res, next) => {
  try {
    const freeShippingThreshold = parseNonNegativeNumber(
      req.body?.freeShippingThreshold
    );
    const todayDeliveryPrice = parseNonNegativeNumber(
      req.body?.todayDeliveryPrice
    );
    const sevenDayDeliveryPrice = parseNonNegativeNumber(
      req.body?.sevenDayDeliveryPrice
    );
    const hasPaystackPayload =
      Object.prototype.hasOwnProperty.call(req.body || {}, "paystackTestApiKey") ||
      Object.prototype.hasOwnProperty.call(req.body || {}, "paystackLiveApiKey") ||
      Object.prototype.hasOwnProperty.call(req.body || {}, "paystackMode");

    if (
      freeShippingThreshold === null ||
      todayDeliveryPrice === null ||
      sevenDayDeliveryPrice === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Free shipping threshold, today delivery price, and 7-day delivery price must be numeric values greater than or equal to 0",
      });
    }

    if (hasPaystackPayload && !isSuperAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can update Paystack configuration",
      });
    }

    let paystackTestApiKey;
    let paystackLiveApiKey;
    let paystackMode;
    if (hasPaystackPayload) {
      paystackTestApiKey = String(req.body?.paystackTestApiKey || "").trim();
      paystackLiveApiKey = String(req.body?.paystackLiveApiKey || "").trim();
      paystackMode = String(req.body?.paystackMode || "")
        .trim()
        .toLowerCase();

      if (!paystackTestApiKey || !paystackLiveApiKey || !paystackMode) {
        return res.status(400).json({
          success: false,
          message: "Paystack mode, test API key, and live API key are required",
        });
      }

      if (!["test", "live"].includes(paystackMode)) {
        return res.status(400).json({
          success: false,
          message: "Paystack mode must be either test or live",
        });
      }

      if (!PAYSTACK_SECRET_KEY_REGEX.test(paystackTestApiKey)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Paystack test key format. Expected format: sk_test_xxx",
        });
      }

      if (!PAYSTACK_SECRET_KEY_REGEX.test(paystackLiveApiKey)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Paystack live key format. Expected format: sk_live_xxx",
        });
      }

      if (!paystackTestApiKey.startsWith("sk_test_")) {
        return res.status(400).json({
          success: false,
          message: "Test API key must start with sk_test_",
        });
      }

      if (!paystackLiveApiKey.startsWith("sk_live_")) {
        return res.status(400).json({
          success: false,
          message: "Live API key must start with sk_live_",
        });
      }
    }

    let settings = await Settings.getSettings();
    settings.freeShippingThreshold = freeShippingThreshold;
    settings.todayDeliveryPrice = todayDeliveryPrice;
    settings.sevenDayDeliveryPrice = sevenDayDeliveryPrice;
    if (hasPaystackPayload) {
      settings.paystackTestApiKey = paystackTestApiKey;
      settings.paystackLiveApiKey = paystackLiveApiKey;
      settings.paystackMode = paystackMode;
    }
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: mapAdminSettings(settings, isSuperAdmin(req)),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateAdminSettings,
};
