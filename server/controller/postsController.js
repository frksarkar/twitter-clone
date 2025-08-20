const { default: mongoose } = require('mongoose');

const { throwError, notify } = require('../util/helper');
const { uploadImage } = require('../util/uploadImage');
const { User, Reply, Post } = require('../model');

exports.createPost = async function (req, res, next) {
	const { content, replayTo } = req.body;
	const userId = req.user.id;

	try {
		if (!userId) {
			throwError('user not authenticated', 400);
		}
		if (!content) {
			throwError('you must provide a content', 400);
		}

		const config = { content, author: userId, replayTo };

		if (req.files?.length > 0) {
			const uploadPromise = req.files?.map((file) => uploadImage(file.buffer, file.originalname, 'posts'));
			const uploadedFiles = await Promise.all(uploadPromise);
			config.media = uploadedFiles;
		}

		const newPost = await Post.create(config);

		await newPost.populate({ path: 'author', select: '_id name username avatar' });

		res.status(201).json({
			status: 'success',
			message: 'Post created successfully',
			newPost,
		});
	} catch (error) {
		next(error);
	}
};

exports.getAllPosts = async function (req, res, next) {
	const { isAuthor, userId, isReply, isFollowing, search, cursor, limit = 10 } = req.query;

	try {
		const authorId = req.user.id;

		const matchConditions = [];

		if (cursor && cursor !== '') {
			matchConditions.push({
				createdAt: { $lt: new Date(cursor) },
			});
		}

		if (isAuthor === 'true') {
			matchConditions.push({
				author: new mongoose.Types.ObjectId(authorId),
			});
		}

		if (userId && userId !== '' && isAuthor !== 'true') {
			matchConditions.push({
				author: new mongoose.Types.ObjectId(userId),
			});
		}

		if (search) {
			matchConditions.push({
				content: { $regex: search, $options: 'i' },
			});
		}

		if (isReply === 'true') {
			matchConditions.push({
				replayTo: { $exists: true },
			});
		}

		if (isFollowing === 'true') {
			const user = await User.findById(authorId).select('following').exec();
			matchConditions.push({
				author: { $in: user.following },
			});
		}

		const pipeline = [
			...(matchConditions.length ? [{ $match: { $and: matchConditions } }] : []),
			{
				$lookup: {
					from: 'users',
					localField: 'author',
					foreignField: '_id',
					as: 'author',
				},
			},
			{ $unwind: '$author' },
			{
				$project: {
					'author.password': 0,
					'author.website': 0,
					'author.email': 0,
					'author.phone': 0,
					'author.location': 0,
					'author.coverPicture': 0,
					'author.updatedAt': 0,
					'author.createdAt': 0,
					'author.__v': 0,
					'author.likes': 0,
					'author.followers': 0,
					'author.following': 0,
					'author.dateOfBirth': 0,
					'author.bio': 0,
				},
			},
			{
				$lookup: {
					from: 'posts',
					localField: 'retweetData',
					foreignField: '_id',
					as: 'retweetData',
				},
			},
			{ $unwind: { path: '$retweetData', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'users',
					localField: 'retweetData.author',
					foreignField: '_id',
					as: 'retweetData.author',
				},
			},
			{ $unwind: { path: '$retweetData.author', preserveNullAndEmptyArrays: true } },
			{
				$project: {
					'retweetData.author.password': 0,
					'retweetData.author.website': 0,
					'retweetData.author.email': 0,
					'retweetData.author.phone': 0,
					'retweetData.author.location': 0,
					'retweetData.author.coverPicture': 0,
					'retweetData.author.updatedAt': 0,
					'retweetData.author.createdAt': 0,
					'retweetData.author.__v': 0,
					'retweetData.author.likes': 0,
					'retweetData.author.followers': 0,
					'retweetData.author.following': 0,
					'retweetData.author.dateOfBirth': 0,
					'retweetData.author.bio': 0,
				},
			},

			{ $sort: { createdAt: -1 } },
			{ $limit: Number(limit) },
		];

		const allPosts = await Post.aggregate(pipeline);

		res.status(200).json({
			status: 'success',
			message: 'Posts fetched successfully',
			posts: allPosts,
		});
	} catch (error) {
		next(error);
	}
};

exports.getPost = async function (req, res, next) {
	const postId = req.params.id;
	const post = await Post.findById({ _id: postId })
		.sort({ createdAt: -1 })
		.populate({
			path: 'author',
			select: '-password',
		})
		.populate({
			path: 'retweetData',
			populate: 'author',
		});

	res.status(200).json(post);
};

exports.updateLike = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const userId = req.user.id;

		if (!(postId && userId)) {
			throwError('You must provide a post id and user id', 400);
		}

		const user = await User.findById(userId).exec();
		const like = user.likes.includes(postId);
		const method = like ? '$pull' : '$addToSet';

		await User.findByIdAndUpdate(userId, { [method]: { likes: postId } }, { new: true });

		const post = await Post.findByIdAndUpdate(postId, { [method]: { likedBy: userId } }, { new: true });

		const state = method === '$addToSet' ? 'like' : 'unlike';
		const updateMessage = `@${user.username} ${state} your post`;

		// notification
		notify(userId, post.author, 'like', `${user.username} ${state} your post`, postId, like);

		res.status(200).json({
			status: 'success',
			message: updateMessage,
			state,
		});
	} catch (error) {
		next(error);
	}
};

exports.retweetPost = async (req, res, next) => {
	const postId = req.params.id;
	const userId = req.user.id;

	try {
		if (!postId || !userId) {
			throwError('You must provide a post id and user id', 400);
		}

		const postAuthor = await Post.findById(postId).exec();

		if (postAuthor.author._id.toString() === userId) {
			throwError('You can not retweet your own post', 400);
		}

		const deleteRetweet = await Post.findOneAndDelete({
			author: userId,
			retweetData: postId,
		});

		const method = deleteRetweet ? '$pull' : '$addToSet';

		let retweet;
		if (!deleteRetweet) {
			retweet = await Post.create({
				author: userId,
				retweetData: postId,
			});

			await retweet.populate([
				{ path: 'retweetData', populate: { path: 'author', select: '_id name username avatar' } },
				{ path: 'author', select: '_id name username avatar' },
			]);
		}

		const updatedPost = await Post.findByIdAndUpdate(postId, { [method]: { retweetedBy: userId } }, { new: true });

		const message = deleteRetweet ? 'Unretweet your post' : 'Retweet your post';
		const user = await User.findById(userId).exec();

		notify(userId, postAuthor.author, 'retweet', `${user.username} ${message}`, postId, deleteRetweet);

		res.status(200).json({
			status: 'success',
			state: deleteRetweet ? 'delete' : 'retweet',
			message: 'updated successfully',
			data: deleteRetweet ? updatedPost : retweet,
		});
	} catch (error) {
		next(error);
	}
};

exports.deletePost = async (req, res, next) => {
	const postId = req.params.id;
	const userId = req.user.id;
	try {
		const deletePost = await Post.findOneAndDelete({
			_id: postId,
			author: userId,
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
	const loginUserId = req.user.id;
	const postId = req.params.id;

	try {
		if (!loginUserId) throwError('You must be logged in', 401);
		if (!postId) throwError('You must provide a post id', 400);

		await Post.updateMany({ author: loginUserId, pinned: { $ne: false } }, { pinned: false });

		const post = await Post.findOne({ author: loginUserId, _id: postId });
		if (!post) throwError('You can only pin your own posts', 401);

		post.pinned = req.body.pinned;
		await post.save();

		const pinnedMsg = post.pinned ? 'Post pinned successfully' : 'Post unpinned successfully';

		// notify the user
		notify(loginUserId, post.author, 'pinned', post._id, post.pinned);

		res.status(200).json({ status: 'success', message: pinnedMsg, data: post });
	} catch (error) {
		next(error);
	}
};

exports.replyPost = async (req, res, next) => {
	const postId = req.params.id;
	const postReplyId = req.params.replyId;
	const userId = req.user.id;
	const { content, media } = req.body;

	try {
		if (!postId || !userId) {
			throwError('You must provide a post id and user id', 400);
		}

		const post = await Post.findById(postId).exec();

		if (!post) {
			throwError('Post not found', 404);
		}

		const reply = await Reply.create({
			author: userId,
			content,
			media,
			parentTweetId: postId,
			parentReplyId: postReplyId,
		});

		res.status(201).json({
			status: 'success',
			message: 'Reply created successfully',
			data: reply,
		});
	} catch (error) {
		next(error);
	}
};
