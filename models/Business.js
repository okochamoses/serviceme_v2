const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
    businessName: String,
    streetAddress: String,
    state: String,
    lga: String,
    landmark: String,
    description: String,
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "categories"
    },
    images: [String]
})

module.exports = mongoose.model("businesses", businessSchema);