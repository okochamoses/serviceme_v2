const mongoose = require("mongoose");
const { PASSWORD_RESET_TIMEOUT } = require("../config/keys");

const passwordResetSchema = new mongoose.Schema({
  email: String,
  isActive: { type: Boolean, default: true },
  initiateTime: {
    type: Date,
    default: () => Date.now(),
  },
  expiresIn: {
    type: Date,
    default: () => Date.now() + (PASSWORD_RESET_TIMEOUT * 60 * 1000)
  },
  token: { type: String, default: () => Math.floor(Math.random() * 1000000000) },
  otp: { type: String, default: () => Math.floor(Math.random() * 100000) },
  otpVerified: {type: Boolean, default: false}
});

module.exports = mongoose.model("passwordResets", passwordResetSchema);
