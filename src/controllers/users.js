const joi = require('joi');
const rescue = require('express-rescue');
const jwt = require('jsonwebtoken');

const Service = require('../services/users');
const validadeFields = require('../helpers/joi');

const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]/i;
const jwtConfig = { expiresIn: '1h', algorithm: 'HS256' };
const { JWT_SECRET } = process.env;

const EXISTING_USER = 'User already registered';
const INVALID_EMAIL = '"email" must be a valid email';
const INVALID_FIELDS = 'Invalid fields';
const NON_EXISTING_USERS = 'No user registered yet';
const USER_NOT_FOUND = 'User does not exist';

const CONFLICT = 409;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const OK = 200;
const NO_CONTENT = 204;

const createUserSchema = joi.object({
  displayName: joi.string().min(8).required(),
  email: joi.string().required(),
  password: joi.string().length(6).required(),
  image: joi.string().required(),
});

const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

const create = rescue(async (req, res) => {
  const validation = validadeFields(createUserSchema, req.body);
  if (validation.error) {
    const { error } = validation;
    return res.status(error.code).json({ message: error.message });
  }
  const { email } = req.body;
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    return res.status(BAD_REQUEST).json({ message: INVALID_EMAIL });
  }
  const newUser = await Service.create(req.body);
  if (!newUser) return res.status(CONFLICT).json({ message: EXISTING_USER });
  const token = jwt.sign({ email }, JWT_SECRET, jwtConfig);

  return res.status(CREATED).json({ token });
});

const login = rescue(async (req, res) => {
  const { email, password } = req.body;
  const validation = validadeFields(loginSchema, req.body);
  if (validation.error) {
    const { error } = validation;
    return res.status(error.code).json({ message: error.message });
  }
  const existing = await Service.findByEmail(email);
  if (!existing) return res.status(BAD_REQUEST).json({ message: INVALID_FIELDS });
  const token = jwt.sign({ email, password }, JWT_SECRET, jwtConfig);
  return res.status(OK).json({ token });
});

const getAll = rescue(async (_req, res) => {
  const users = await Service.getAll();
  if (!users) {
    return res.status(NOT_FOUND).json({ message: NON_EXISTING_USERS });
  }
  res.status(OK).json(users);
});

const getById = rescue(async (req, res) => {
  const { params: { id } } = req;
  const user = await Service.getById(id);
  if (!user) {
    return res.status(NOT_FOUND).json({ message: USER_NOT_FOUND });
  }
  res.status(OK).json(user);
});

const removeUSer = rescue(async (req, res) => {
  const { user: email } = req;
  await Service.remove(email);
  return res.status(NO_CONTENT).end();
});

module.exports = {
  login,
  create,
  getAll,
  getById,
  removeUSer,
};