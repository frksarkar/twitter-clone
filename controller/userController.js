const { User } = require('../module/userSchema');

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
	const loginUser = req.session.user._id;

	const user = await User.findByIdAndUpdate(userId, {$addToSet: {followers}})
};
