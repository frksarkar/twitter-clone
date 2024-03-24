const { User } = require('../module/userSchema');
const { notify } = require('../util/helper');
const { uploadImage } = require('../util/uploadImage');

exports.filteredUsers = async function (req, res, next) {
	const search = req.query.search;
	try {
		const filteredUsers = await User.find({
			userName: { $regex: search, $options: 'i' },
		}).select('-password');

		res.status(200).json(filteredUsers);
	} catch (error) {
		next(error);
	}
};

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

	try {
		if (!(loginUser && userId)) {
			throwError('You must provide a id and loginUser id', 400);
		}
		const follow =
			loginUser?.following && loginUser.following.includes(userId);

		const method = follow ? '$pull' : '$addToSet';
		req.session.user = await User.findByIdAndUpdate(
			loginUser._id,
			{ [method]: { following: userId } },
			{ new: true }
		);

		const newFollowers = await User.findByIdAndUpdate(
			userId,
			{ [method]: { followers: loginUser._id } },
			{ new: true }
		);

		const action = follow ? 'Follow' : 'Following';

		//	notification
		await notify(loginUser._id, userId, 'follow', loginUser._id, follow);

		res.status(200).json({
			status: 'success',
			message: 'updated successfully',
			data: newFollowers,
			action,
		});
	} catch (error) {
		next(error);
	}
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
		next(err);
	}
};
