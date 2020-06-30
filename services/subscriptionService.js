const locations = require("../util/states.json")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const logger = require("../config/logger")

exports.subscribe = (req, res) => {
    const {plan, amount, startDate, duration} = req.body;
    return res.json(new ServiceResponse(ResponseCode.SUCCESS, "Not implemented"))
}