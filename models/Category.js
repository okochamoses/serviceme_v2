const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: String,
    code: String,
    image: String
})

module.exports = mongoose.model("categories", categorySchema);
