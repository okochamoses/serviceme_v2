const encryptionService = require("../util/hashing");
const sessionRepository = require("../repositories/sessionRepository")

exports.processSessionToken = async (req, res, next) => {
    let token = req.get("Authorization");
    token = token.replace("Bearer ", ""); // remove

    if (token === undefined) {
        return res.json({ code: 20, description: "Please pass a sessionId" })
    }

    const decoded = encryptionService.decodeToken(token);

    if (typeof decoded !== "string") {
        const session = await sessionRepository.findById(token);
        if (session.sessionEnd > new Date()) {
            await sessionRepository.update(session.userId);
            res.user = decoded
            return next();
        }
    }
    return res.json({ code: 20, description: "Authentication failed" })
};
