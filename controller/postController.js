const { Post } = require('../module/PostSchema');
const { throwError } = require('../util/helper');

exports.createPost = async function (req, res, next) {
	const { content } = req.body;
	const user = req.session.user;
	try {
		if (!(req.session && req.session.user)) {
			throwError('user not authenticated', 400);
		}
		if (!content) {
			throwError('you must provide a content', 400);
		}
		const newPost = await Post.create({ content, postedBy: user.userId });

		await newPost.populate({ path: 'postedBy', select: '-password' });

		res.status(201).json({
			status: 'success',
			message: 'Post created successfully',
			data: newPost,
		});
	} catch (error) {
		next(error);
	}
};

exports.getAllPosts = async function (req, res) {
	const allPosts = await Post.find().sort({ createdAt: -1 }).populate({
		path: 'postedBy',
		select: '-password',
	});

	res.status(200).json(allPosts);
};
