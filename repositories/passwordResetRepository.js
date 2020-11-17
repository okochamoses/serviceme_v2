const Password = require("../models/PasswordReset");
const PasswordReset = require("../models/PasswordReset");

const findById = async passwordResetId => {
    const passwordReset = await PasswordReset.findById(passwordResetId);
    return passwordReset;
};

const findByEmail = async email => {
    const passwordReset = await PasswordReset.findOne({ email, isActive: true });
    return passwordReset;
};

const findByToken = async token => {
    const passwordReset = await PasswordReset.findOne({ token, isActive: true });
    return passwordReset;
};

const save = async (passwordReset) => {
    // Invalidate existing 
    const oldPasswordReset = await PasswordReset.findOne({ email: passwordReset.email, isActive: true });
    if(oldPasswordReset) {
        oldPasswordReset.isActive = false;
        oldPasswordReset.save();
    }
    
    const passwordResetModel = new PasswordReset(passwordReset);
    const savedPasswordReset = await passwordResetModel.save();

    return savedPasswordReset;
};

const completed = async (passwordReset) => {
    // Invalidate existing 
    const oldPasswordReset = await PasswordReset.findOne({ email: passwordReset.email, isActive: true });
    if(oldPasswordReset) {
        oldPasswordReset.isActive = false;
        oldPasswordReset.otpVerified = true;
        return await oldPasswordReset.save();
    }

    return null;
};

const update = async (userId) => {
    const existingPasswordReset = await findByUserId(userId);
    if (existingPasswordReset !== null) {
        existingPasswordReset.passwordResetEnd = Date.now() + (30 * 60 * 1000)
        return await existingPasswordReset.save();
    }
};

module.exports = {
    findById,
    findByEmail,
    findByToken,
    completed,
    save,
    update
};
