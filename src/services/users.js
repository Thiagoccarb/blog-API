const { User, BlogPost } = require('../models');

const create = async (data) => {
  try {
    const newUser = await User.create(data);
    console.log(newUser);
    return newUser.dataValues;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const findByEmail = async (email) => {
  const existing = await User.findOne({ where: { email }, raw: true });
  if (!existing) {
    return null;
  }
  return existing;
};

const getAll = async () => {
  const allUsers = await User.findAll({ raw: true });
  if (!allUsers) {
    return null;
  }
  return allUsers;
};

const getById = async (id) => {
  const user = await User.findOne({ where: { id }, raw: true });
  if (!user) {
    return null;
  }
  return user;
};

const remove = async (email) => {
  const user = await findByEmail(email);
  const userId = user.id;
  await BlogPost.destroy({ where: { userId } });
  await User.destroy({ where: { email } });
};

module.exports = {
  create,
  findByEmail,
  getAll,
  getById,
  remove,
};