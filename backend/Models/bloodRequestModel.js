const mongoose = require("mongoose");

const bloodRequestSchema = mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receiver",
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
  },
  {
    timestamps: true,
  }
);

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

module.exports = BloodRequest;
