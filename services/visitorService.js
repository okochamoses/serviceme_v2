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

exports.getVisitorsByDateRange = async (req, res) => {
  try {
    const { businessId, startDate, endDate } = req.body;

    // const visitors = await visitorRepository.findByDateRange({ businessId, startDate, endDate });

    // console.log(visitors)

    return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS, businesses));
  } catch (error) {
    logger.error("An Error has occured: " + error.message);
    return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR));
  }
};
