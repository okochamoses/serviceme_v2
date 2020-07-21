const validator = require("validator");

exports.validateBusiness = (body) => {
    const { businessName, streetAddress, state, lga, landmark, categoryId, providerId, email, phone } = body;
    if(businessName === undefined || validator.isEmpty(businessName)) {
        return "Please enter a valid business name"
    }
    if(streetAddress === undefined || validator.isEmpty(streetAddress)) {
        return "Please enter a valid street address"
    }
    if(email === undefined || validator.isEmpty(email)) {
        return "Please enter a valid email"
    }
    if(phone === undefined || validator.isEmpty(phone)) {
        return "Please enter a phone number"
    }
    if(state === undefined || validator.isEmpty(state)) {
        return "Please enter a state"
    }
    if(lga === undefined || validator.isEmpty(lga)) {
        return "Please enter a valid lga"
    }
    if(landmark === undefined || validator.isEmpty(landmark)) {
        return "Please enter a valid landmark"
    }
    if(categoryId === undefined || !validator.isMongoId(categoryId)) {
        return "Please select a category"
    }
    if(providerId === undefined || !validator.isMongoId(providerId)) {
        return "Please select a provider"
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