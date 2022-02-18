const router = require('express').Router();

const users = require('./users');
const categories = require('./categories');
const posts = require('./blogPosts');
const auth = require('../middlwares/auth');

router.post('/user', users.create);
router.post('/login', users.login);
router.post('/post', auth, posts.create);
router.post('/categories', auth, categories.create);
router.put('/post/:id', auth, posts.update);
router.get('/post/search', auth, posts.getByQuery);
router.get('/post/:id', auth, posts.getAllPostsUsersCategoriesById);
router.get('/post', auth, posts.getAllPostsUsersCategories);
router.get('/user/:id', auth, users.getById);
router.get('/user', auth, users.getAll);
router.get('/categories', auth, categories.getAll);
router.delete('/post/:id', auth, posts.remove);
router.delete('/user/me', auth, users.removeUSer);

module.exports = router;