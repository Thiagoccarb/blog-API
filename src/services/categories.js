const { Category } = require('../models');

const create = async (category) => {
  try {
    const newCategory = await Category.create(category);
    return newCategory.dataValues;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getAll = async () => {
  const categories = await Category.findAll({ raw: true });
  if (!categories) {
    return null;
  }
  return categories;
};

const getById = async (id) => {
  const categories = await Category.findOne({ where: { id }, raw: true });
  if (!categories) {
    return null;
  }
  return categories;
};

module.exports = {
  create,
  getAll,
  getById,
};