const providerRepository = require("../repositories/providerRepository");
const sessionRepository = require("../repositories/sessionRepository")
const logger = require("../config/logger")
const encryption = require("../util/hashing")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const { validateProviderRegistration, validateProviderLogin, validateCustomerRegistration } = require("../validation/authValidation");
const customerRepository = require("../repositories/customerRepository");

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
        const token = encryption.generateToken({ email: provider.email, id: provider._id, type: "provider" }, "provider")

        // Save token to session
        await sessionRepository.save({ sessionId: token, userId: provider._id });

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, token))
    } catch (error) {
        logger.error(error.message);
    }
}

exports.registerProvider = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, isProvider, subscribe, rememberMe } = req.body;

        const error = validateProviderRegistration(req.body);
        if (error) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, error))
        }

        // Get provider by email
        let checkProvider = await providerRepository.findByEmail(email);
        if (checkProvider !== null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "A user with that email already exists"))
        }
        checkProvider = await providerRepository.findByPhone(phone);
        if (checkProvider !== null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "A user with that phone already exists"))
        }

        const hashedPassword = encryption.hash(password);
        const provider = {
            firstName, lastName, email, phone, password: hashedPassword, isProvider
        }

        const savedProvider = await providerRepository.save(provider);
        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, savedProvider))
    } catch (error) {
        logger.error(error.message)
    }
}

exports.changeProviderPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        console.log(req.user)
        const { email } = req.user;
        const provider = await providerRepository.findByEmail(email);
        if (provider === null) {
            return res.json(new ServiceResponse(ResponseCode.AUTH_FAILURE, "Oops! Something went wrong. Please try again"))
        }
        if (!encryption.comparePassword(oldPassword, provider.password)) {
            return res.json(new ServiceResponse(ResponseCode.AUTH_FAILURE, "You entered the wrong password"))
        }

        const password = encryption.hash(newPassword);
        provider.password = password;
        const updatedProvider = await providerRepository.update(provider);
        console.log(updatedProvider, password);

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, "Your password has been changed successfully"))
    } catch (error) {
        logger.error(error.message)
        console.log(error)
        return res.json(new ServiceResponse(ResponseCode.FAILURE, ResponseMessage.FAILURE));
    }
}

exports.registerCustomer = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        const error = validateCustomerRegistration(req.body);
        if (error) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, error))
        }

        if (await customerRepository.findByEmail(email) !== null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "An account with that email already exists"))
        }

        if (await customerRepository.findByPhone(phone) !== null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "An account with that phone number already exists"))
        }

        const hashedPassword = encryption.hash(password);
        const savedCustomer = await customerRepository.save({ firstName, lastName, email, phoneNumber:phone, password: hashedPassword })

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, savedCustomer))
    } catch (error) {
        logger.error(error.message)
        return res.json(new ServiceResponse(ResponseCode.FAILURE, ResponseMessage.FAILURE));
    }
}

exports.customerLogin = async (req, res) => {
    try {
        const { loginId, password } = req.body;
        let customer = null;
        if(loginId.includes("@")) {
            customer = await customerRepository.findByEmail(loginId);
        } else {
            customer = await customerRepository.findByPhone(loginId);
        }
        console.log(customer)

        if (customer === null) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Invalid login ID / password combination"))
        }

        if(await !encryption.comparePassword(password, customer.password)) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Invalid login ID / password combination"))
        }

        // Generate token
        const token = encryption.generateToken({ email: customer.email, id: customer._id, type: "customer" }, "customer")

        // Save token to session
        sessionRepository.save({ sessionId: token, userId: customer._id });

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, token))
    } catch (error) {
        logger.error(error.message)
        return res.json(new ServiceResponse(ResponseCode.FAILURE, ResponseMessage.FAILURE));
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