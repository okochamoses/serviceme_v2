const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    password: String,
    isActive: {
      type: Boolean,
      default: true
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "providers"
    }]
})

module.exports = mongoose.model("customers", customerSchema);