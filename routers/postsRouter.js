const express = require('express');
const post = require('../controller/postsController');

const postRouter = express.Router();

postRouter.post('/', post.createPost);

postRouter.get('/', post.getAllPosts);

postRouter.get('/:id', post.getPost);

postRouter.delete('/:id', post.deletePost);

postRouter.post('/:id/tweet', post.retweetPost);

postRouter.put('/:id/like', post.updateLike);

postRouter.put('/:id/pinned', post.pinnedPost);

exports.postsRouter = postRouter;
