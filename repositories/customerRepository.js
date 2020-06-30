const Customer = require("../models/Customer");

const findByName = async name => {
  const customer = await Customer.findOne({ name });
  return customer;
};

const findByEmail = async email => {
  const customer = await Customer.findOne({ email });
  return customer;
};

const findByPhone = async phoneNumber => {
  const customer = await Customer.findOne({ phoneNumber });
  return customer;
};

const findById = async id => {
  const customer = await Customer.findById(id);
  return customer;
};

const findAll = async () => {
  const customers = await Customer.find();
  return customers;
};

const save = async (customer) => {
  const customerModel = new Customer(customer);
  const savedCustomer = await customerModel.save();
  return savedCustomer;
};

const update = async (id, body) => {
  const customer = await Customer.findOneAndUpdate({ _id: id }, { $set: body }, { new: true });
  return customer;
};

module.exports = {
  findByName,
  findByEmail,
  findByPhone,
  findById,
  findAll,
  save,
  update
};
