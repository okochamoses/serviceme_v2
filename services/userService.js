const providerRepository = require("../repositories/providerRepository");
const sessionRepository = require("../repositories/sessionRepository")
const logger = require("../config/logger")
const encryption = require("../util/hashing")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const { validateProviderRegistration, validateProviderLogin } = require("../validation/authValidation")

exports.authenticateProvider = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate request body
        const error = validateProviderLogin(req.body);
        if (error) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, error))
        }

        // Get provider by email
        const provider = await providerRepository.findByEmail(email);
        if (provider === null) {
            return res.json(new ServiceResponse(ResponseCode.AUTH_FAILURE, "Authentication failed"))
        }
        if (!encryption.comparePassword(password, provider.password)) {
            return res.json(new ServiceResponse(ResponseCode.AUTH_FAILURE, "Authentication failed"))
        }

        // Generate token
        const token = encryption.generateToken({ email: provider.email, id: provider._id, type: "provider"}, "provider")

        // Save token to session
        sessionRepository.save({sessionId: token, userId: provider._id});

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, token))
    } catch (error) {
        logger.error(error.message);
    }
}

exports.registerProvider = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        const error = validateProviderRegistration(req.body);
        if (error) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, error))
        }

        const hashedPassword = encryption.hash(password);
        const provider = {
            firstName, lastName, email, phone, password: hashedPassword
        }

        const savedProvider = await providerRepository.save(provider);
        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, savedProvider))
    } catch (error) {
        logger.error(error.message)
    }
}

exports.logout = async (req, res) => {
    try {
        const { body } = req;
        return res.json({ message: "Implementation not done" })
    } catch (error) {
        logger.error(error.message)
    }
}