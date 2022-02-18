const { Op } = require('sequelize');
const { BlogPost, Category, User } = require('../models');
const PostsCategoriesService = require('./postsCategories');
const CategoriesService = require('./categories');

const create = async (post) => {
  try {
    const { categoryIds } = post;
    const categories = await Promise.all(categoryIds
      .map((categoryId) => CategoriesService.getById(categoryId)));
    if (categories.some((category) => !category)) {
      return { error: { message: '"categoryIds" not found' } };
    }
    const newPost = await BlogPost.create(post);
    const { dataValues: { id } } = newPost;
    const data = categoryIds.map((categoryId) => ({
      postId: id,
      categoryId,
    }));
    await PostsCategoriesService.create(data);
    return newPost.dataValues;
  } catch (err) {
    return null;
  }
};

const getAll = async () => {
  const posts = await BlogPost.findAll({
    attributes: { exclude: ['userId'] },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });
  if (!posts) {
    return null;
  }
  return posts;
};

const getById = async (id) => {
  const post = await BlogPost.findOne({
    where: { id },
    raw: true,
  });
  if (!post) {
    return null;
  }
  return post;
};

const getAllDataById = async (id) => {
  const post = await BlogPost.findOne({
    where: { id },
    attributes: { exclude: ['userId'] },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });
  if (!post) {
    return null;
  }
  return post;
};

const update = async (id, data) => {
  const post = await BlogPost.findOne({ where: { id } });
  if (!post) return null;
  const { title, content } = data;
  post.title = title;
  post.content = content;
  await post.save();
  const updatedPost = await BlogPost.findOne({
    where: { id },
    attributes: { exclude: ['published', 'updated'] },
    include: [
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });
  return updatedPost;
};

const findByQuery = async (itemSeached) => {
  const post = await BlogPost.findOne({
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
    where: {
      [Op.or]: [
        { title: itemSeached },
        { content: itemSeached },
      ],
    },
  });
  if (!post) return [];
  return [post];
};

const remove = async (id) => BlogPost.destroy({ where: { id } });

module.exports = {
  create,
  getAll,
  getAllDataById,
  update,
  remove,
  getById,
  findByQuery,
};