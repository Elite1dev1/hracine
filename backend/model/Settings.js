const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    freeShippingThreshold: {
      type: Number,
      required: true,
      default: 200,
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
    settings = await this.create({ freeShippingThreshold: 200 });
  }
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
