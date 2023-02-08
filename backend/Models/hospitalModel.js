const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const hospitalSchema = mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    hospitalCode: {
      type: String,
      required: true,
    },
    bloodSamples: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BloodSample",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Matching the entered Password by the user
hospitalSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Encrypting the password before saving it to the database
hospitalSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
