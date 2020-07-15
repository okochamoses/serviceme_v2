const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: Number,
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: "providers"
    },
})

module.exports = mongoose.model("reviews", reviewSchema);