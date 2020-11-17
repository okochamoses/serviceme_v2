const providerRepository = require("../repositories/providerRepository");
const sessionRepository = require("../repositories/sessionRepository")
const logger = require("../config/logger")
const mailer = require("../config/mailer")
const encryption = require("../util/hashing")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const { validateProviderRegistration, validateProviderLogin, validateCustomerRegistration } = require("../validation/authValidation");
const customerRepository = require("../repositories/customerRepository");
const passwordResetRepository = require("../repositories/passwordResetRepository");
const PasswordReset = require("../models/PasswordReset");
const { PASSWORD_RESET_TIMEOUT } = require("../config/keys");

exports.authenticateProvider = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate request body
        const error = validateProviderLogin(req.body);
        if (error) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, error))
        }

        // Get provider by email
        let provider;
        if(email.includes("@")) {
            provider = await providerRepository.findByEmail(email);
        } else {
            provider = await providerRepository.findByPhone(email);
        }
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

// export const initiateForgotPassword = async(email) => {
//     export const verifyOtp = async(email, otp, token) => {
//     export const completePasswordReset = async(password, confirmPassword, token) => {

exports.initiateForgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const passwordReset = new PasswordReset();
        passwordReset.email = email

        const saved = await passwordResetRepository.save(passwordReset);

        mailer.sendMail(email, "Password Reset", `
        <p>Hi,</p>
        <h3>${saved.otp}</h3>
        <p>A password reset has been initiated on your account. Please use this otp to verify your password reset.</p>
        <p>Ignore this email if the password reset was not initiated by you</p>
        `)

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, {email: saved.email, token: saved.token, timeout: PASSWORD_RESET_TIMEOUT}))
    } catch (error) {
        console.log(error)
        return res.json(new ServiceResponse(ResponseCode.FAILURE, ResponseMessage.FAILURE));
    }
}

exports.verifyOtp = async(req, res) => {
    try {
        const { email, otp, token } = req.body;

        const passwordReset = await passwordResetRepository.findByEmail(email);

        console.log(passwordReset)
        if(!passwordReset) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Invalid email"));
        }

        if(passwordReset.expiresIn < new Date()) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "OTP has expired"));
        }

        if(passwordReset && passwordReset.token === token) {
            if(passwordReset.otp === otp) {
                await passwordReset.update({otpVerified: true})
                return res.json(new ServiceResponse(ResponseCode.SUCCESS, "OTP Verified", {email: passwordReset.email, otp: passwordReset.otp, token: passwordReset.token,}))
            }
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "OTP verification failed"));
        } else {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Invalid token"));
        }
    } catch (error) {
        console.log(error)
        return res.json(new ServiceResponse(ResponseCode.FAILURE, ResponseMessage.FAILURE));
    }
}

exports.completePasswordReset = async(req, res) => {
    try {
        const { password: newPassword, confirmPassword, token } = req.body;

        if(newPassword !== confirmPassword) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Passwords do not match"))
        }

        const pass = await passwordResetRepository.findByToken(token);
        console.log(pass)
        if(!pass) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, "Invalid Token"))
        }
        
        const email = pass.email;
        const provider = await providerRepository.findByEmail(email);

        const password = encryption.hash(confirmPassword);
        provider.password = password;
        const updatedProvider = await providerRepository.update(provider);
        
        await passwordResetRepository.completed(pass)

        return res.json(new ServiceResponse(ResponseCode.SUCCESS, "Your password has been changed successfully"))
    } catch (error) {
        console.log(error)
        return res.json(new ServiceResponse(ResponseCode.FAILURE, ResponseMessage.FAILURE));
    }
}
