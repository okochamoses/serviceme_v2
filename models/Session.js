const mongoose = require("mongoose");
const {SESSION_TIMEOUT} = require("../config/keys")

const sessionSchema = new mongoose.Schema({
    sessionId: String,
    userId: mongoose.Types.ObjectId,
    sessionStart: {
        type: Date,
        default: Date.now
    },
    sessionEnd: {
        type: Date,
        default: () => Date.now() + (SESSION_TIMEOUT * 60 * 1000)
    },
})

module.exports = mongoose.model("sessions", sessionSchema);