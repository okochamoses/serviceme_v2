const Provider = require("../models/Provider");

const findByPhone = async phone => {
  const provider = await Provider.findOne({ phone });
  return provider;
};

const findById = async id => {
  const provider = await Provider.findById(id);
  return provider;
};

const findByEmail = async email => {
  const provider = await Provider.findOne({ email });
  return provider;
};

const findAll = async () => {
  const providers = await Provider.find();
  return providers;
};

const save = async (provider) => {
    const providerModel = new Provider(provider);
  const savedProvider = await providerModel.save();
  return savedProvider;
};

const update = async (id, body) => {
  const provider = await Provider.findOneAndUpdate({ _id: id }, { $set: body }, { new: true });
  return provider;
};

module.exports = {
  findById,
  findByPhone,
  findByEmail,
  findAll,
  save,
  update
};
