const joi = require('joi');
const rescue = require('express-rescue');

const Service = require('../services/categories');
const validadeFields = require('../helpers/joi');

const EMPTY_CATEGORY = 'No category registered yet';

const CREATED = 201;
const NOT_FOUND = 404;
const OK = 200;

const createCategorySchema = joi.object({
  name: joi.string().required(),
});

const create = rescue(async (req, res) => {
  const { body: { name } } = req;
  const validation = validadeFields(createCategorySchema, req.body);
  if (validation.error) {
    const { error } = validation;
    return res.status(error.code).json({ message: error.message });
  }
  const newCategory = await Service.create({ name });
  return res.status(CREATED).json(newCategory);
});

const getAll = rescue(async (req, res) => {
  const categories = await Service.getAll();
  if (!categories) {
    return res.status(NOT_FOUND).json({ message: EMPTY_CATEGORY });
  }
  res.status(OK).json(categories);
});

module.exports = {
  create,
  getAll,
};