const validator = require("validator");

exports.validateProviderRegistration = (body) => {
    const { firstName, lastName, email, phone, password } = body;
    if(email === undefined || !validator.isEmail(email)) {
        return "Please enter a valid email"
    }
    if(firstName === undefined || validator.isEmpty(firstName)) {
        return "Please enter a valid firstName"
    }
    if(lastName === undefined || validator.isEmpty(lastName)) {
        return "Please enter a valid lastName"
    }
    if(phone === undefined || !validator.isMobilePhone(phone, "en-NG")) {
        return "Please enter a valid phone"
    }
    if(password === undefined) {
        return "Please enter a valid password"
    }
    if(password.length < 6) {
        return "Password must be 6 characters or more"
    }

    return false;
}

exports.validateProviderLogin = (body) => {
    const { email, password } = body;
    
    if(email === undefined || !validator.isEmail(email)) {
        return "Please enter a valid email"
    }

    if(password === undefined || validator.isEmpty(password)) {
        return "Please enter a valid password"
    }

    return false
}