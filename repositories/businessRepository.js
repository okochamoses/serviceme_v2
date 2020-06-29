const Business = require("../models/Business");

const findByName = async businessName => {
  const business = await Business.findOne({ businessName });
  return business;
};

const findById = async id => {
  const business = await Business.findById(id);
  return business;
};

const findAll = async () => {
  const businesses = await Business.find();
  return businesses;
};

const save = async (business) => {
  if(business._id !== null || business._id !== undefined) {
    return await business.save();
  }
  const businessModel = new Business(business);
  const savedBusiness = await businessModel.save();
  return savedBusiness;
};

const update = async (id, body) => {
  const business = await Business.findOneAndUpdate({ _id: id }, { $set: body }, { new: true });
  return business;
};

module.exports = {
  findByName,
  findById,
  findAll,
  save,
  update
};
