const Category = require("../models/Category");

const findByName = async name => {
  const category = await Category.findOne({ name });
  return category;
};

const findByCode = async code => {
  const category = await Category.findOne({ code });
  return category;
};

const findById = async id => {
  const category = await Category.findById(id);
  return category;
};

const findAll = async () => {
  const categories = await Category.find();
  return categories;
};

const save = async (category) => {
  const categoryModel = new Category(category);
  const savedCategory = await categoryModel.save();
  return savedCategory;
};

const update = async (id, body) => {
  const category = await Category.findOneAndUpdate({ _id: id }, { $set: body }, { new: true });
  return category;
};

module.exports = {
  findByName,
  findByCode,
  findById,
  findAll,
  save,
  update
};
