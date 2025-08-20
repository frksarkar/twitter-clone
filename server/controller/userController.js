const { default: mongoose } = require('mongoose');
const { User, Post, Reply } = require('../model');
const { notify, throwError } = require('../util/helper');
const { uploadImage, mediaUpload } = require('../util/uploadImage');

exports.filteredUsers = async function (req, res, next) {
	const username = req.query.username;
	try {
		const filteredUsers = await User.findOne({
			username: { $regex: username, $options: 'i' },
		}).select('-password -createdAt -updatedAt -__v');

		if (!filteredUsers) {
			throwError('No user found with this username', 404);
		}
		res.status(200).json({ status: 'success', data: filteredUsers });
	} catch (error) {
		next(error);
	}
};

exports.getFollowerAndFollowing = async function (req, res, next) {
	const userId = req.params.userId;
	const { action } = req.query;
	try {
		if (!userId || !action) {
			throwError('You must provide a id and action', 400);
		}
		if (!['followers', 'following'].includes(action)) {
			throwError('You must provide a valid action', 400);
		}

		const findUser = await User.findById(userId).select(`${action}`).populate(`${action}`);

		const Payload = {
			pageTitle: action,
			loginUser: req.session.user,
			loginUserJs: JSON.stringify(req.session.user),
			activeTab: action,
			user: findUser,
		};
		res.render('followerAndFollowing', Payload);
	} catch (error) {
		next(error);
	}
};

exports.getFollow = async function (req, res, next) {
	const targetUserId = req.params.userId;
	const currentUserId = req.user.id;

	try {
		if (!currentUserId || !targetUserId) {
			throwError('You must provide both current user ID and target user ID', 400);
		}

		const [currentUser, targetUser] = await Promise.all([User.findById(currentUserId), User.findById(targetUserId)]);

		if (!currentUser || !targetUser) {
			throwError('User not found', 404);
		}

		const isFollowing = currentUser.following.includes(targetUserId);
		const updateOperation = isFollowing ? '$pull' : '$addToSet';

		await Promise.all([
			User.findByIdAndUpdate(currentUserId, { [updateOperation]: { following: targetUserId } }, { new: true }),
			User.findByIdAndUpdate(targetUserId, { [updateOperation]: { followers: currentUserId } }, { new: true }),
		]);

		const action = isFollowing ? 'unfollow' : 'follow';
		notify(currentUserId, targetUserId, 'follow', `${currentUser.name} has ${action}ed you`, currentUserId, isFollowing);

		res.status(200).json({
			status: 'success',
			message: 'Updated successfully',
			action,
		});
	} catch (error) {
		next(error);
	}
};

exports.updateRepliesLike = async function (req, res, next) {
	const replyId = req.params.replyId;
	const loginUserId = req.user.id;
	const loginUserName = req.user.name;
	try {
		const reply = await Reply.findById(replyId);
		if (!reply) {
			throwError('Reply not found', 404);
		}

		const isLiked = reply.likes.includes(loginUserId);
		const updateOperation = isLiked ? '$pull' : '$addToSet';

		await Reply.findByIdAndUpdate(replyId, { [updateOperation]: { likes: loginUserId } }, { new: true });

		// Notify the author of the reply if the user is not the author
		if (reply.author.toString() !== loginUserId) {
			notify(loginUserId, reply.author, 'like', `${loginUserName} has ${isLiked ? 'unliked' : 'liked'} your reply`, replyId, isLiked);
		}

		res.status(200).json({
			status: 'success',
			message: 'Updated successfully',
			action: isLiked ? 'unlike' : 'like',
		});
	} catch (error) {
		next(error);
	}
};

exports.profilePicUpdate = function (req, res, next) {
	req.uploadFieldName = 'avatar';
	next();
};

exports.coverPicUpdate = function (req, res, next) {
	req.uploadFieldName = 'coverPicture';
	next();
};

exports.updatePicture = async function (req, res, next) {
	const userId = req.user.id;

	try {
		let imageName = Date().split(' ');
		imageName.length = 5;
		imageName = imageName.join('-');
		imageName = imageName + '-' + userId;

		const imageUrl = await uploadImage(req.file.buffer, imageName, req.uploadFieldName);

		await User.findByIdAndUpdate(userId, {
			[req.uploadFieldName]: imageUrl,
		});

		res.status(200).json({
			status: 'susses',
			message: `${req.uploadFieldName} updated successfully`,
			imageUrl,
		});
	} catch (err) {
		next(err);
	}
};

exports.getPostLikedByUsers = async (req, res, next) => {
	try {
		const authorId = req.query.userId || req.user.id;

		const users = await Post.aggregate([
			{ $match: { author: new mongoose.Types.ObjectId(authorId) } },
			{ $project: { likedBy: 1 } },
			{ $unwind: '$likedBy' },
			{ $group: { _id: '$likedBy', id: { $first: '$likedBy' } } },
			{ $lookup: { from: 'users', localField: 'id', foreignField: '_id', as: 'user' } },
			{ $unwind: '$user' },
			{ $project: { _id: 0, name: '$user.name', username: '$user.username', avatar: '$user.avatar', verified: '$user.verified' } },
		]);

		res.json({
			status: 'success',
			message: 'successfully fetched',
			likes: users,
		});
	} catch (err) {
		next(err);
	}
};

exports.updateUser = async function (req, res, next) {
	const userId = req.user.id;
	try {
		if (!!req.files) {
			for (const key in req.files) {
				req.body[key] = await mediaUpload(req.files[key][0].buffer, userId, 'profile');
			}
		}
		const user = await User.findByIdAndUpdate(userId, { ...req.body }, { new: true }).select('name username avatar coverPicture bio location website verified');
		res.status(200).json({
			status: 'success',
			message: 'updated successfully',
			data: user,
		});
	} catch (err) {
		next(err);
	}
};
