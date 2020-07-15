const validator = require("validator");
const locations = require("../util/states.json")

exports.validateBusiness = (body) => {
    const { categoryId, stateCode, lga } = body;
    if(stateCode !== undefined) {
        let s;
        locations.forEach(location => {
            if(location.code === stateCode) {
                s = location.name;
            }
        })
        if(s === undefined) {
            return "Please enter a valid state code"
        }
    }
    
    if(categoryId === undefined || !validator.isMongoId(categoryId)) {
        return "Please select a category"
    }

    return false;
}