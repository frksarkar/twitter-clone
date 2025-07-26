const { Post, User } = require('../model');

exports.getBookmarkData = async (req, res, next) => {
	// response user related twitted data
	try {
		const userId = req.user.id;
		const user = await User.findById(userId).select('bookmarks');

		const bookmarks = await Post.find({ _id: { $in: user.bookmarks } })
			.populate([{ path: 'author', select: '_id name username avatar' }])
			.sort({ createdAt: -1 });

		res.json({
			status: 'success',
			message: 'Bookmarks fetched successfully',
			posts: bookmarks,
		});
	} catch (err) {
		res.status(500).json({ error: 'Failed to get bookmarks' });
	}
};

exports.updateBookmarkData = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const postId = req.params.id;
		const user = await User.findById(userId);
		const isBookmarked = user.bookmarks.includes(postId);
		const method = isBookmarked ? '$pull' : '$addToSet';
		const userBookmarks = await User.findByIdAndUpdate(
			userId,
			{ [method]: { bookmarks: postId } },
			{ new: true }
		).select('bookmarks');

		res.json({
			status: 'success',
			message: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
			userBookmarks,
		});
	} catch (err) {
		next(err);
	}
};
