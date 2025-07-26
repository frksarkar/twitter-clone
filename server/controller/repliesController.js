const mongoose = require('mongoose');

const { ref, deleteObject } = require('firebase/storage');
const { firebaseStorage } = require('../config/databaseConnection');
const { Reply, Post } = require('../model');
const { notify, throwError } = require('../util/helper');
const { uploadImage } = require('../util/uploadImage');

exports.getReplies = async (req, res, next) => {
	const notificationId = req.params.id;
	try {
		const replies = await Reply.findOne({ _id: notificationId }).populate('author').exec();
		res.status(200).json({ status: 'success', data: replies });
	} catch (error) {
		next(error);
	}
};

exports.getPostReplies = async (req, res, next) => {
	const postId = req.params.id;
	try {
		if (!postId) {
			return next({ status: 400, message: 'Post id is required' });
		}
		const replies = await Reply.find({ parentTweetId: postId })
			.populate({ path: 'author', select: '_id name username avatar verified' })
			.exec();

		res.status(200).json({ status: 'success', data: replies });
	} catch (error) {
		next(error);
	}
};

exports.getUserReplies = async (req, res, next) => {
	try {
		const currentUserId = req.query.userId || req.user.id;

		const userId = new mongoose.Types.ObjectId(currentUserId);

		const replies = await Post.aggregate([
			{ $match: { author: userId } },
			{ $project: { _id: 1 } },
			{ $unwind: '$_id' },

			{
				$lookup: {
					from: 'replies', // Step 3: Join with replies
					localField: '_id', // post._id
					foreignField: 'parentTweetId', // replies.postId
					as: 'replies',
				},
			},
			{ $unwind: '$replies' },
			{ $replaceRoot: { newRoot: '$replies' } },
			{
				$lookup: {
					from: 'users', // Step 6: Join with users
					localField: 'author', // reply.author
					foreignField: '_id', // users._id
					as: 'author',
				},
			},
			{ $unwind: '$author' },
			{
				$project: {
					_id: 1,
					content: 1,
					timestamp: 1,
					author: {
						_id: 1,
						name: 1,
						username: 1,
						avatar: 1,
						verified: 1,
					},
					parentTweetId: 1,
					media: 1,
					likes: 1,
				},
			},
		]);

		res.json({ status: 'success', message: 'Replies fetched successfully', data: replies });
		// const replies = await Reply.find({ author: req.user.id })
		// 	.populate({ path: 'author', select: '_id name username avatar verified' })
		// 	.exec();
		// res.status(200).json({ status: 'success', message: 'Replies fetched successfully', data: replies });
	} catch (error) {
		next(error);
	}
};

exports.createReply = async (req, res, next) => {
	const { content, replyToId } = req.body;
	const postId = req.params.id;
	const authorId = req.user.id;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		if (!authorId || !postId || !content) {
			throwError({
				status: 400,
				message: 'User not authenticated, post id is required and content is required',
			});
		}

		const post = await Post.findById(postId).session(session).exec();
		if (post.author.toString() === authorId) {
			throwError({ status: 400, message: 'You can not comment on your own post' });
		}

		const replyData = {
			content,
			author: authorId,
			parentTweetId: postId,
			parentReplyId: replyToId,
		};

		if (req.files?.length) {
			const media = await Promise.all(
				req.files.map((file) => uploadMedia(file.buffer, file.originalname, authorId, 'posts'))
			);
			replyData.media = media;
		}

		const reply = await Reply.create([replyData], { session });
		const newReply = reply[0];

		await newReply.populate({ path: 'author', select: '_id name username avatar verified' });

		// increment the reply count
		post.replyTo = (post.replyTo || 0) + 1;
		await post.save({ session });

		notify(authorId, post.author._id, 'reply', newReply._id, false);

		await session.commitTransaction();
		session.endSession();

		res.status(201).json({
			status: 'success',
			message: 'Reply created successfully',
			reply: newReply,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};

exports.deleteReply = async (req, res, next) => {
	const replayId = req.params.id;
	const authorId = req.user.id;

	// start transaction
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		if (!authorId || !replayId) {
			throwError({
				status: 400,
				message: 'User not authenticated, post id is required and content is required',
			});
		}

		const reply = await Reply.findOne({ _id: replayId, author: authorId }).session(session).exec();

		if (!reply) {
			throwError({ status: 400, message: 'You can not comment on your own post' });
		}

		// reply post from image delete to firebase
		await deleteImages(reply.media);

		// decrement the reply count
		const post = await Post.findById(reply.parentTweetId).session(session).exec();
		if (!post) {
			throwError({ status: 400, message: 'Post not found' });
		}

		post.replyTo = (post.replyTo || 0) - 1;
		await post.save({ session });

		await reply.deleteOne({ session });

		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			status: 'success',
			message: 'Reply deleted successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		next(error);
	}
};

function deleteImages(urls) {
	const deletePromises = urls.map((url) => {
		const path = decodeURIComponent(url.split('/o/')[1].split('?alt=')[0]);
		const fileRef = ref(firebaseStorage, path);
		return deleteObject(fileRef);
	});

	return Promise.all(deletePromises);
}

function uploadMedia(buffer, fileName, userId, savePath) {
	let imageName = Date().split(' ');
	imageName.length = 5;
	imageName = imageName.join('-');
	imageName = imageName + '-' + fileName + '-' + userId;
	const media = uploadImage(buffer, imageName, savePath);
	return media;
}
