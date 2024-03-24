const express = require('express');

const { payloadHandler } = require('../middleware/payload');

const routers = express.Router();

routers.get('/:id', payloadHandler('Post'), async (req, res, next) => {
	const postId = req.params.id;
	res.render('post-page', { postId });
});

exports.postRouter = routers;
