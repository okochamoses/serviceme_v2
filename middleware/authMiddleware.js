const encryptionService = require("../util/hashing");
const sessionRepository = require("../repositories/sessionRepository")
const ServiceResponse  = require("../util/ServiceResponse")
const {ResponseCode, ResponseMessage} = require("../util/Responses")

exports.processSessionToken = async (req, res, next) => {
    let token = req.get("Authorization");

    if (token === undefined) {
        return res.json({ code: ResponseCode.AUTH_FAILURE, description: "Please pass a sessionId" })
    }
    token = token.replace("Bearer ", ""); // remove

    const decoded = encryptionService.decodeToken(token);

    if (typeof decoded !== "string") {
        const session = await sessionRepository.findById(token);
        if (session.sessionEnd > new Date()) {
            await sessionRepository.update(session.userId);
            req.user = decoded
            return next();
        }
    }
    return res.json({ code: ResponseCode.AUTH_FAILURE, description: ResponseMessage.AUTH_FAILURE })
};
