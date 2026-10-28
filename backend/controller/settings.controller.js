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
  preOrderFreeShippingThreshold: settings.preOrderFreeShippingThreshold,
  freeShippingBannerText: settings.freeShippingBannerText,
  todayDeliveryPrice: settings.todayDeliveryPrice,
  sevenDayDeliveryPrice: settings.sevenDayDeliveryPrice,
  rootCheckFee: settings.rootCheckFee,
  createdAt: settings.createdAt,
  updatedAt: settings.updatedAt,
});

const mapAdminSettings = (settings) => ({
  ...mapPublicSettings(settings),
  paystackMode: settings.paystackMode || "test",
  paystackTestApiKeyConfigured: Boolean(settings.paystackTestApiKey),
  paystackLiveApiKeyConfigured: Boolean(settings.paystackLiveApiKey),
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
    res.status(200).json({
      success: true,
      data: mapAdminSettings(settings),
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
    const preOrderFreeShippingThreshold = parseNonNegativeNumber(
      req.body?.preOrderFreeShippingThreshold
    );
    const rootCheckFee = parseNonNegativeNumber(req.body?.rootCheckFee);
    const freeShippingBannerText = String(
      req.body?.freeShippingBannerText || ""
    ).trim();
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
      preOrderFreeShippingThreshold === null ||
      rootCheckFee === null ||
      rootCheckFee <= 0 ||
      !freeShippingBannerText ||
      todayDeliveryPrice === null ||
      sevenDayDeliveryPrice === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Shipping thresholds, Root Check fee, and delivery prices must be valid values",
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
      const rawTestKey = req.body?.paystackTestApiKey;
      const rawLiveKey = req.body?.paystackLiveApiKey;
      paystackTestApiKey = typeof rawTestKey === "string" ? rawTestKey.trim() : "";
      paystackLiveApiKey = typeof rawLiveKey === "string" ? rawLiveKey.trim() : "";
      paystackMode = typeof req.body?.paystackMode === "string"
        ? req.body.paystackMode.trim().toLowerCase()
        : "";

      if (paystackMode && !["test", "live"].includes(paystackMode)) {
        return res.status(400).json({
          success: false,
          message: "Paystack mode must be either test or live",
        });
      }

      if (paystackTestApiKey && !PAYSTACK_SECRET_KEY_REGEX.test(paystackTestApiKey)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Paystack test key format. Expected format: sk_test_xxx",
        });
      }

      if (paystackLiveApiKey && !PAYSTACK_SECRET_KEY_REGEX.test(paystackLiveApiKey)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Paystack live key format. Expected format: sk_live_xxx",
        });
      }

      if (paystackTestApiKey && !paystackTestApiKey.startsWith("sk_test_")) {
        return res.status(400).json({
          success: false,
          message: "Test API key must start with sk_test_",
        });
      }

      if (paystackLiveApiKey && !paystackLiveApiKey.startsWith("sk_live_")) {
        return res.status(400).json({
          success: false,
          message: "Live API key must start with sk_live_",
        });
      }
    }

    let settings = await Settings.getSettings();
    settings.freeShippingThreshold = freeShippingThreshold;
    settings.preOrderFreeShippingThreshold = preOrderFreeShippingThreshold;
    settings.freeShippingBannerText = freeShippingBannerText;
    settings.todayDeliveryPrice = todayDeliveryPrice;
    settings.sevenDayDeliveryPrice = sevenDayDeliveryPrice;
    settings.rootCheckFee = rootCheckFee;
    if (hasPaystackPayload) {
      if (paystackTestApiKey) settings.paystackTestApiKey = paystackTestApiKey;
      if (paystackLiveApiKey) settings.paystackLiveApiKey = paystackLiveApiKey;
      if (paystackMode) settings.paystackMode = paystackMode;

      const activeKey = settings.paystackMode === "live"
        ? settings.paystackLiveApiKey
        : settings.paystackTestApiKey;
      if (!activeKey) {
        return res.status(400).json({
          success: false,
          message: `Configure the ${settings.paystackMode} API key before selecting this mode`,
        });
      }
    }
    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: mapAdminSettings(settings),
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
