const { User } = require('../module/userSchema');
const { uploadImage } = require('../util/uploadImage');

exports.getFollowerAndFollowing = async function (req, res, next) {
	const userId = req.params.userId;
	const { action } = req.query;
	const findUser = await User.findById(userId)
		.select(`${action}`)
		.populate(`${action}`);

	const Payload = {
		pageTitle: action,
		loginUser: req.session.user,
		loginUserJs: JSON.stringify(req.session.user),
		activeTab: action,
		user: findUser,
	};
	res.render('followerAndFollowing', Payload);
};

exports.getFollow = async function (req, res, next) {
	const userId = req.params.userId;
	const loginUser = req.session.user;

	if (!(loginUser && userId)) {
		throwError('You must provide a id and loginUser id', 400);
	}
	const follow = loginUser?.following && loginUser.following.includes(userId);

	const method = follow ? '$pull' : '$addToSet';
	req.session.user = await User.findByIdAndUpdate(
		loginUser._id,
		{
			[method]: { following: userId },
		},
		{ new: true }
	);

	const newFollowers = await User.findByIdAndUpdate(
		userId,
		{
			[method]: { followers: loginUser._id },
		},
		{ new: true }
	);

	const action = follow ? 'Follow' : 'Following';

	res.status(200).json({
		status: 'success',
		message: 'updated successfully',
		data: newFollowers,
		action,
	});
};

exports.profilePicUpdate = function (req, res, next) {
	req.uploadFieldName = 'profilePicture';
	next();
};

exports.coverPicUpdate = function (req, res, next) {
	req.uploadFieldName = 'coverPicture';
	next();
};

exports.updatePicture = async function (req, res, next) {
	const userId = req.params.userId;

	try {
		let imageName = Date().split(' ');
		imageName.length = 5;
		imageName = imageName.join('-');
		imageName = imageName + '-' + userId;

		const imageUrl = await uploadImage(req.file.buffer, imageName);

		req.session.user = await User.findByIdAndUpdate(userId, {
			[req.uploadFieldName]: imageUrl,
		});

		res.status(200).json({ message: 'susses' });
	} catch (err) {
		console.log('🚀 ~ file: userController.js:62 ~ l:', err);
	}
};
