const { Post } = require('../module/PostSchema');
const { User } = require('../module/userSchema');
const { throwError, notify } = require('../util/helper');

exports.createPost = async function (req, res, next) {
	const { content, replayTo } = req.body;
	const user = req.session.user;
	try {
		if (!(req.session && req.session.user)) {
			throwError('user not authenticated', 400);
		}
		if (!content) {
			throwError('you must provide a content', 400);
		}
		const newPost = await Post.create({
			content,
			postedBy: user._id,
			replayTo,
		});

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

exports.getAllPosts = async function (req, res, next) {
	const query = req.query;
	const searchObj = {};
	if (query.postedBy && query.isReply == 'false') {
		searchObj.postedBy = query.postedBy;
		searchObj.replayTo = { $exists: false };
	}
	if (query.postedBy && query.isReply == 'true') {
		searchObj.postedBy = query.postedBy;
		searchObj.replayTo = { $exists: true };
	}

	if (query.search) {
		searchObj.content = { $regex: query.search };
	}

	const allPosts = await Post.find(searchObj)
		.sort({ createdAt: -1 })
		.populate({
			path: 'postedBy',
			select: '-password',
		})
		.populate({
			path: 'retweetData',
			populate: 'postedBy',
		});

	res.status(200).json(allPosts);
};

exports.getPost = async function (req, res, next) {
	const postId = req.params.id;
	const post = await Post.findById({ _id: postId })
		.sort({ createdAt: -1 })
		.populate({
			path: 'postedBy',
			select: '-password',
		})
		.populate({
			path: 'retweetData',
			populate: 'postedBy',
		});

	res.status(200).json(post);
};

exports.updateLike = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const loginUserId = req.session?.user?._id;

		if (!(postId && loginUserId)) {
			throwError('You must provide a post id and user id', 400);
		}
		const likes =
			req.session?.user?.likes && req.session.user.likes.includes(postId);

		const method = likes ? '$pull' : '$addToSet';
		req.session.user = await User.findByIdAndUpdate(
			loginUserId,
			{
				[method]: { likes: postId },
			},
			{ new: true }
		);

		const post = await Post.findByIdAndUpdate(
			postId,
			{
				[method]: { likes: loginUserId },
			},
			{ new: true }
		);

		// notification
		await notify(loginUserId, post.postedBy, 'like', postId, likes);

		res.status(200).json({
			status: 'success',
			message: 'updated successfully',
			data: post,
		});
	} catch (error) {
		console.log(
			'🚀 ~ file: postController.js:128 ~ exports.updateLike= ~ error:',
			error
		);
	}
};

exports.retweetPost = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const loginUserId = req.session?.user?._id;
		if (!(postId && loginUserId)) {
			throwError('You must provide a post id and user id', 400);
		}

		const deletePost = await Post.findOneAndDelete({
			postedBy: loginUserId,
			retweetData: postId,
		});

		const method = deletePost ? '$pull' : '$addToSet';

		let newRetweet;
		if (!deletePost) {
			newRetweet = await Post.create({
				postedBy: loginUserId,
				retweetData: postId,
			});

			await newRetweet.populate({
				path: 'retweetData',
				populate: 'postedBy',
			});
			await newRetweet.populate('postedBy');
		}

		req.session.user = await User.findByIdAndUpdate(
			loginUserId,
			{ [method]: { retweet: postId } },
			{ new: true }
		);

		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{ [method]: { retweetUsers: loginUserId } },
			{ new: true }
		);

		//	notify the user
		notify(
			loginUserId,
			updatedPost.postedBy,
			'retweet',
			postId,
			deletePost
		);

		res.status(200).json({
			status: 'success',
			message: 'updated successfully',
			newRetweet,
			updatedPost,
		});
	} catch (error) {
		console.log(
			'🚀 ~ file: postController.js:180 ~ exports.retweetPost= ~ error:',
			error
		);
	}
};

exports.deletePost = async (req, res, next) => {
	const postId = req.params.id;
	const loginUserId = req.session.user._id;
	try {
		const deletePost = await Post.findOneAndDelete({
			_id: postId,
			postedBy: loginUserId,
		});

		res.status(200).json({
			status: 'success',
			message: 'deleted successfully',
			data: deletePost,
		});
	} catch (err) {
		next(err);
	}
};

exports.pinnedPost = async (req, res, next) => {
	const loginUserId = req.session.user?._id;
	const postId = req.params.id;
	if (!loginUserId) return res.redirect('login');
	try {
		if (req.body.pinned) {
			await Post.updateMany({ postedBy: loginUserId }, { pinned: false });
		}

		await Post.findByIdAndUpdate(postId, req.body);
		res.status(204).end();
	} catch (error) {
		console.log(
			'🚀 ~ file: postController.js:191 ~ exports.pinnedPost= ~ error:',
			error
		);
		next(error);
	}
};
