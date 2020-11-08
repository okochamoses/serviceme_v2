const visitorRepository = require("../repositories/visitorRepository");
const ServiceResponse = require("../util/ServiceResponse");
const { ResponseCode, ResponseMessage } = require("../util/Responses");
const logger = require("../config/logger");
const Visitor = require("../models/Visitor");

exports.addNewVisitor = async (req, res) => {
  try {
    const { ip, businessId, customerId, longitude, latitude, deviceId } = req.body;
    const visitor = new Visitor({ ip, business: businessId, customer: customerId, deviceId, longitude, latitude });
    console.log(visitor);
    if (!(await isNewVisitor(customerId, businessId, deviceId))) {
      return res.json(new ServiceResponse(ResponseCode.FAILURE, "Not a new visitor"));
    }

    visitorRepository.save(visitor);

    return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS));
  } catch (error) {
    console.log(error);
    logger.error("An Error has occured: " + error.message);
    return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR));
  }
};

const isNewVisitor = async (visitorId, businessId, deviceId) => {
  let visitor;
  if(!deviceId) {
    visitor = await visitorRepository.findByDeviceId(deviceId);

    console.log(visitor)
    if (!visitor) {
      return true;
    }
    if (visitor.time < new Date(new Date() - 30 * 60000)) {
      return true;
    }
    return false;
  }

  if(!businessId || !visitorId) {
    visitor = await visitorRepository.findByCustomerAndBusiness(visitorId, businessId);

    if (visitor === null) {
      return true;
    }
    if (visitor.time < new Date(new Date() - 30 * 60000)) {
      return true;
    }
    return false;
  }

  return false;
};

exports.getVisitorsByDateRangeAndBusinessId = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const {businessId} = req.params;

    const visitors = await visitorRepository.findByDateRangeAndBusinessId(startDate, endDate,  businessId );

    // console.log(visitors)

    return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, visitors));
  } catch (error) {
    logger.error("An Error has occured: " + error.message);
    return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR));
  }
};

exports.getVisitorsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    console.log(req.user)
    const { email } = req.user;

    const visitors = await visitorRepository.findByDateRangeAndUserId(startDate, endDate,  email );

    console.log(visitors)

    return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, visitors));
  } catch (error) {
    logger.error("An Error has occured: " + error.message);
    return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR));
  }
};
