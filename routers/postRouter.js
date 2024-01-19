const express = require('express');
const multer = require('multer');
const upload = multer();
const { createPost } = require('../controller/postController');

const postRouter = express.Router();

postRouter.post('/', createPost);

exports.postRouter = postRouter;
