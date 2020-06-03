const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    password: String,
    isActive: {
      type: Boolean,
      default: true
    },
    businesses: [{
        type: mongoose.Schema.ObjectId,
        ref: "businesses"
    }]
})

module.exports = mongoose.model("providers", providerSchema);