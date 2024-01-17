const { Post } = require("../module/PostSchema");

exports.createPost = function (req, res, next) {
	// Post.create(req.body.create);
	req.session.post = req.body.content;

	res.status(201).json({
		message: 'Post created successfully',

	});
};
