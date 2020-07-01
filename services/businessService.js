const businessRepository = require("../repositories/businessRepository")
const {validateBusiness} = require("../validation/businessValidation")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const logger = require("../config/logger")


exports.searchBusiness = async (req, res) => {
    try {
        // Validate payload
        const validationError = validateBusiness(req.body);
        if (validationError) {
            return res.json(new ServiceResponse(ResponseCode.FAILURE, validationError))
        }

        const { categoryId, state, lga } = req.body;
        const businesses = await businessRepository.findByCategoryAndStateAndLga(categoryId, state, lga)
        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, businesses))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}
