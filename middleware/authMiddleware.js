const encryptionService = require("../util/hashing");
const sessionRepository = require("../repositories/sessionRepository")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")

exports.processSessionToken = async (req, res, next) => {
    try {
        console.log(req.path);
        let token = req.get("Authorization");
        console.log(token)

        if (token === undefined) {
            return res.json(new ServiceResponse(ResponseCode.AUTH_FAILURE, "Please pass a sessionId"))
        }
        token = token.replace("Bearer ", ""); // remove
        const decoded = encryptionService.decodeToken(token);

        if (typeof decoded !== "string") {
            const session = await sessionRepository.findById(token);
            console.log(session)
            if (session !== null && session.sessionEnd > new Date()) {
                await sessionRepository.update(session.userId);
                req.user = decoded
                return next();
            }
        }
        return res.json({ status: ResponseCode.AUTH_FAILURE, description: ResponseMessage.AUTH_FAILURE })

    } catch (error) {
        console.log(error)
    }
};
