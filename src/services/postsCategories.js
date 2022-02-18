const { PostCategory } = require('../models');

const create = async (data) => {
  try {
    await Promise.all(
      data.map(({ postId, categoryId }) => PostCategory.create({ postId, categoryId })),
    );
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = {
  create,
};