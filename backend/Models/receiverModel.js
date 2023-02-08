const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const receiverSchema = mongoose.Schema(
  {
    receiverName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Matching the entered Password by the user
receiverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Encrypting the password before saving it to the database
receiverSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Receiver = mongoose.model("Receiver", receiverSchema);

module.exports = Receiver;
