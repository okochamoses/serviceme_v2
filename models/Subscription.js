const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    plan: String,
    startDate: Date,
    endDate: Date,
    amount: String,
    providerId: {
        type: mongoose.Schema.ObjectId,
    },
})

module.exports = mongoose.model("subscriptions", subscriptionSchema);