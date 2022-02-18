const joi = require('joi');
const rescue = require('express-rescue');

const PostService = require('../services/blogPost');
const UserService = require('../services/users');

const validadeFields = require('../helpers/joi');

const CATEGORY_NOT_FOUND = 'No category registered yet';
const POST_NOT_FOUND = 'Post not found';
const UNAUTHORIZED_USER = 'Unauthorized user';
const NO_CATEGORIES_ID = 'Categories cannot be edited';
const NON_EXISTING_POST = 'Post does not exist';

const UNAUTHORIZED = 401;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const OK = 200;
const NO_CONTENT = 204;

const createPostSchema = joi.object({
  title: joi.string().required(),
  content: joi.string().required(),
  categoryIds: joi.required(),
});

const updatedPostSchema = joi.object({
  title: joi.required(),
  content: joi.required(),
});

const create = rescue(async (req, res) => {
  const validation = validadeFields(createPostSchema, req.body);
  if (validation.error) {
    const { error } = validation;
    return res.status(error.code).json({ message: error.message });
  }
  const { user: email } = req;
  const user = await UserService.findByEmail(email);
  const data = { ...req.body, userId: user.id };
  const newPost = await PostService.create(data);
  if (newPost.error) {
    const { error: { message } } = newPost;
    return res.status(BAD_REQUEST).json({ message });
  }
  return res.status(CREATED).json(newPost);
});

const getAll = rescue(async (req, res) => {
  const categories = await PostService.getAll();
  if (!categories) {
    return res.status(NOT_FOUND).json({ message: CATEGORY_NOT_FOUND });
  }
  res.status(OK).json(categories);
});

const getByQuery = rescue(async (req, res) => {
  const { q } = req.query;
  const post = await PostService.findByQuery(q);
  if (!q) {
    const posts = await PostService.getAll();
    res.status(OK).json(posts);
  }
  res.status(OK).json(post);
});

const getAllPostsUsersCategories = rescue(async (req, res) => {
  const posts = await PostService.getAll();
  if (!posts) {
    return res.status(NOT_FOUND).json({ message: CATEGORY_NOT_FOUND });
  }
  res.status(OK).json(posts);
});

const getAllPostsUsersCategoriesById = rescue(async (req, res) => {
  const { id } = req.params;
  const post = await PostService.getAllDataById(id);
  if (!post) {
    return res.status(NOT_FOUND).json({ message: NON_EXISTING_POST });
  }
  res.status(OK).json(post);
});

const update = rescue(async (req, res) => {
  const { params: { id }, body, body: { categoryIds }, user: email } = req;
  if (categoryIds) return res.status(BAD_REQUEST).json({ message: NO_CATEGORIES_ID });
  const validation = validadeFields(updatedPostSchema, body);
  if (validation.error) {
    const { error } = validation;
    return res.status(error.code).json({ message: error.message });
  }
  const user = await UserService.findByEmail(email);
  const post = await PostService.getById(id);
  if (!post) {
    return res.status(NOT_FOUND).json({ message: POST_NOT_FOUND });
  }
  if (user.id !== post.userId) {
    return res.status(UNAUTHORIZED).json({ message: UNAUTHORIZED_USER });
  }
  const updatedPost = await PostService.update(id, body);
  res.status(OK).json(updatedPost);
});

const remove = rescue(async (req, res) => {
  const { params: { id }, user: email } = req;
  const post = await PostService.getById(id);
  if (!post) return res.status(NOT_FOUND).json({ message: NON_EXISTING_POST });
  const user = await UserService.findByEmail(email);
  if (user.id !== post.userId) {
    return res.status(UNAUTHORIZED).json({ message: UNAUTHORIZED_USER });
  }
  await PostService.remove(id);
  res.status(NO_CONTENT).end();
});

module.exports = {
  create,
  getAll,
  getAllPostsUsersCategories,
  getAllPostsUsersCategoriesById,
  update,
  remove,
  getByQuery,
};