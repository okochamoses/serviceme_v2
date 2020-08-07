const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    ip: String,
    time: {
        type: Date,
        default: Date.now
    },
    location: {
        stateCode: String,
        lga: String,
    },
    latitude: String,
    longitude: String,
    business: String,
    customer: String,
})

module.exports = mongoose.model("visitors", visitorSchema);