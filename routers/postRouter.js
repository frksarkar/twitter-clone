const express = require('express');
const post = require('../controller/postController');

const postRouter = express.Router();

postRouter.post('/', post.createPost);

postRouter.get('/', post.getAllPosts);

exports.postRouter = postRouter;
