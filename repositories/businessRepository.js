const Business = require("../models/Business");
const categoryRepository = require("./categoryRepository");

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

const findByCategoryAndStateAndLga = async (categoryId, state, lga) => {
  const document = {category: categoryId};
  state !== undefined ? document.state = state : null;
  lga !== undefined ? document.lga = lga : null;
  const businesses = await Business.find(document);
  return businesses;
}

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
  findByCategoryAndStateAndLga,
  save,
  update
};
