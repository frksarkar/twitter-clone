const express = require('express');
const post = require('../controller/postController');

const postRouter = express.Router();

postRouter.post('/', post.createPost);

postRouter.get('/', post.getAllPosts);

postRouter.post('/:id/tweet', post.retweetPost);

postRouter.put('/:id/like', post.updateLike);

exports.postRouter = postRouter;
