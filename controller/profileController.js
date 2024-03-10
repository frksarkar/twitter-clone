const { User } = require('../module/userSchema');

exports.getProfile = async (req, res, next) => {
	const profileIdAndName = req.params.id;
	let activeTab = 'post';
	if (req.query.tab == 'replies') {
		activeTab = 'replies';
	}

	const findUser = await User.findOne({ userName: profileIdAndName });
	const payload = {
		user: findUser,
		activeTab,
	};
	res.render('profile', payload);
};
