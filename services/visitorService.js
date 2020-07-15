const visitorRepository = require("../repositories/visitorRepository")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const logger = require("../config/logger")

exports.addNewVisitor = async (req, res) => {
    try {
        const {visitorId, businessId, longitude, latitude} = req.body;
        
        return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, businesses))
    } catch (error) {
        logger.error("An Error has occured: " + error.message);
        return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR))
    }
}

const isNewVisitor = async(visitorId, businessId) => {
    const visitor = await visitorRepository.findByCustomerAndBusiness(visitorId, businessId);

    if(visitor.time < new Date(-30)) {
        return true
    }
    return false;
}