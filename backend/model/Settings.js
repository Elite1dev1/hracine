const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    freeShippingThreshold: {
      type: Number,
      required: true,
      default: 200,
    },
    preOrderFreeShippingThreshold: {
      type: Number,
      required: true,
      default: 25000,
    },
    freeShippingBannerText: {
      type: String,
      default: "Free shipping on orders above 25,000",
    },
    todayDeliveryPrice: {
      type: Number,
      required: true,
      default: 60,
    },
    sevenDayDeliveryPrice: {
      type: Number,
      required: true,
      default: 20,
    },
    paystackTestApiKey: {
      type: String,
      default: "",
      trim: true,
    },
    paystackLiveApiKey: {
      type: String,
      default: "",
      trim: true,
    },
    paystackMode: {
      type: String,
      enum: ["test", "live"],
      default: "test",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      freeShippingThreshold: 200,
      preOrderFreeShippingThreshold: 25000,
      freeShippingBannerText: "Free shipping on orders above 25,000",
      todayDeliveryPrice: 60,
      sevenDayDeliveryPrice: 20,
      paystackTestApiKey: "",
      paystackLiveApiKey: "",
      paystackMode: "test",
    });
  } else {
    let isUpdated = false;
    if (typeof settings.preOrderFreeShippingThreshold !== "number") {
      settings.preOrderFreeShippingThreshold = 25000;
      isUpdated = true;
    }
    if (typeof settings.freeShippingBannerText !== "string") {
      settings.freeShippingBannerText = "Free shipping on orders above 25,000";
      isUpdated = true;
    }
    if (typeof settings.todayDeliveryPrice !== "number") {
      settings.todayDeliveryPrice = 60;
      isUpdated = true;
    }
    if (typeof settings.sevenDayDeliveryPrice !== "number") {
      settings.sevenDayDeliveryPrice = 20;
      isUpdated = true;
    }
    if (typeof settings.paystackTestApiKey !== "string") {
      settings.paystackTestApiKey = "";
      isUpdated = true;
    }
    if (typeof settings.paystackLiveApiKey !== "string") {
      settings.paystackLiveApiKey = "";
      isUpdated = true;
    }
    if (!["test", "live"].includes(settings.paystackMode)) {
      settings.paystackMode = "test";
      isUpdated = true;
    }
    if (isUpdated) {
      await settings.save();
    }
  }
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
