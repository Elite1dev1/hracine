const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    biggestConcern: {
      type: String,
      required: [true, "Please select your biggest concern"],
    },
    protectiveStyle: {
      type: String,
      required: [true, "Please select your protective style"],
    },
    preferredDate: {
      type: Date,
      required: [true, "Please select a preferred date"],
    },
    preferredTime: {
      type: String,
      required: [true, "Please select a preferred time"],
    },
    notes: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentReference: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    paymentId: {
      type: String,
      trim: true,
      default: "",
    },
    amountDue: {
      type: Number,
      min: 0,
      default: 0,
    },
    amountPaid: {
      type: Number,
      min: 0,
      default: 0,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
