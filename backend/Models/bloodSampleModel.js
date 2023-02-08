const mongoose = require("mongoose");

const bloodSampleSchema = mongoose.Schema(
  {
    bloodType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BloodSample = mongoose.model("BloodSample", bloodSampleSchema);

module.exports = BloodSample;
