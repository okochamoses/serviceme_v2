const Session = require("../models/Session");

const findById = async sessionId => {
    const session = await Session.findOne({ sessionId });
    return session;
};

const findByUserId = async userId => {
    const session = await Session.findOne({ userId });
    return session;
};

const save = async (session) => {
    // Delete existing 
    await Session.findOneAndDelete({ userId: session.userId })

    const sessionModel = new Session(session);
    const savedSession = await sessionModel.save();

    return savedSession;
};

const update = async (userId) => {
    const existingSession = await findByUserId(userId);
    if (existingSession !== null) {
        existingSession.sessionEnd = Date.now() + (30 * 60 * 1000)
        return await existingSession.save();

    }
};

module.exports = {
    findById,
    save,
    update
};
