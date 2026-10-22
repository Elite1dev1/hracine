const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "User", required: false },
    productId: { type: ObjectId, ref: "Products", required: true, index: true },
    displayName: { type: String, trim: true, default: "", maxlength: 120 },
    rating: { type: Number, min: 1, max: 5, default: undefined },
    comment: { type: String, required: true, trim: true, maxlength: 5000 },
    reviewDate: { type: Date, default: undefined },
    source: { type: String, enum: ["website", "manual"], default: "website", index: true },
    isPublished: { type: Boolean, default: true, index: true },
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reviews", reviewSchema);
