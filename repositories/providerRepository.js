const Provider = require("../models/Provider");

const findByPhone = async phone => {
  const provider = await Provider.findOne({ phone });
  return provider;
};

// const findById = async id => {
//   const provider = await (await Provider.findById(id).populate("businesses").exec());
//   return provider;
// };

const findById = async id => {
  const provider = await Provider.findById(id).populate({
    path : 'businesses',
    populate : {
      path : 'category'
    }
  }).exec()
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

const update = async (provider) => {
  const updatedProvider = await provider.save();
  return updatedProvider;
};

module.exports = {
  findById,
  findByPhone,
  findByEmail,
  findAll,
  save,
  update
};
