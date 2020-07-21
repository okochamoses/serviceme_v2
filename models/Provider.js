const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
    isActive: {
      type: Boolean,
      default: true
    },
    isProvider: {
      type: Boolean,
      default: false
    },
    businesses: [{
        type: mongoose.Schema.ObjectId,
        ref: "businesses"
    }],
    favourites: [{
        type: mongoose.Schema.ObjectId,
        ref: "providers"
    }],
    reviews: [{
      type: mongoose.Schema.ObjectId,
      ref: "reviews"
    }]
})

module.exports = mongoose.model("providers", providerSchema);