const mongoose = require("mongoose");
const validator = require("validator");

const newsletterSchema = mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email"],
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email address is required"],
    },
    source: {
      type: String,
      default: "modal",
      enum: ["modal", "footer", "admin", "other"],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "unsubscribed", "bounced"],
    },
    subscribed_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;
