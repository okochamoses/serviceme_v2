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
    if (!(await isNewVisitor(customerId, businessId))) {
      return res.json(new ServiceResponse(ResponseCode.FAILURE, "Not a new visitor"));
    }

    // const visitor = new Visitor({ ip, business: businessId, customerId: customerId, deviceId })
    // console.log(visitor)
    visitorRepository.save(visitor);

    return res.json(new ServiceResponse(ResponseCode.SUCCESS, ResponseMessage.SUCCESS));
  } catch (error) {
    console.log(error);
    logger.error("An Error has occured: " + error.message);
    return res.json(new ServiceResponse(ResponseCode.ERROR, ResponseMessage.ERROR));
  }
};

const isNewVisitor = async (visitorId, businessId) => {
  const visitor = await visitorRepository.findByCustomerAndBusiness(visitorId, businessId);

  console.log(visitor)
  if (visitor === null) {
    return true;
  }
  if (visitor.time < new Date(-30)) {
    return true;
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
