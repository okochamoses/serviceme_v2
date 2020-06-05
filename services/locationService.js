const locations = require("../util/states.json")
const ServiceResponse = require("../util/ServiceResponse")
const { ResponseCode, ResponseMessage } = require("../util/Responses")
const logger = require("../config/logger")

exports.getStates = (req, res) => {
    const states = locations.map(location => {
        return {name: location.name, code: location.code}
    })
    return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, states))
}

exports.getLga = (req, res) => {
    const {state} = req.params;

    let lga;
    locations.forEach(location => {
        if(location.code === state) {
            lga = location.lgas;
        }
    })

    return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, lga))
}
