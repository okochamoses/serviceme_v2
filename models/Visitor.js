const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    ip: String,
    time: String,
    location: {
        stateCode: String,
        lga: String,
    },
    business: {
        type: mongoose.Schema.ObjectId,
        ref: "businesses"
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: "customers"
    },
})

module.exports = mongoose.model("visitors", visitorSchema);