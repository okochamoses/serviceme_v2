const Visitor = require("../models/Visitor");
const providerRepository = require("./providerRepository")

const findByName = async visitorName => {
  const visitor = await Visitor.findOne({ visitorName });
  return visitor;
};

const findById = async id => {
  const visitor = await Visitor.findById(id);
  return visitor;
};

const findAll = async () => {
  const visitors = await Visitor.find();
  return visitors;
};

const save = async (visitor) => {
  if(visitor._id !== null || visitor._id !== undefined) {
    return await visitor.save();
  }
  const visitorModel = new Visitor(visitor);
  const savedVisitor = await visitorModel.save();
  return savedVisitor;
};

const update = async (id, body) => {
  const visitor = await Visitor.findOneAndUpdate({ _id: id }, { $set: body }, { new: true });
  return visitor;
};

const findByCustomerAndBusiness = async (visitorId, businessId) => {
  return await Visitor.findOne({business: businessId, customer: visitorId});
}

const findByVisitorId = async (visitorId) => {
  return await Visitor.findOne({customer: visitorId});
}

const findByDeviceId = async (deviceId) => {
  return await Visitor.findOne({deviceId});
}

const findByDateRangeAndBusinessId = async (startDate, endDate, businessId) => {
  return await Visitor.countDocuments({"time": {"$gte":  new Date(startDate), "$lt": new Date(endDate)}, business: businessId })
};

const findByDateRangeAndUserId = async (startDate, endDate, email) => {
  const user = await providerRepository.findByEmail(email);
  console.log(user)
  return await Visitor.countDocuments({"time": {"$gte":  new Date(startDate), "$lt": new Date(endDate)}, business: {$in: user.businesses} })
};

module.exports = {
  findByName,
  findById,
  findAll,
  save,
  update,
  findByCustomerAndBusiness,
  findByVisitorId,
  findByDeviceId,
  findByDateRangeAndBusinessId,
  findByDateRangeAndUserId
};
