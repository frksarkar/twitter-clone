const mongoose = require('mongoose');
const { User } = require('../module/userSchema');

exports.getProfile = async (req, res, next) => {
	const profileIdAndName = req.params.id;
	let activeTab = 'post';
	if (req.query.tab == 'replies') {
        activeTab = 'replies';
	}
    console.log("🚀 ~ exports.getProfile= ~ activeTab:", activeTab)

	const findUser = await User.findOne({ userName: profileIdAndName });
	const Payload = {
		pageTitle: 'Profile',
		loginUser: req.session.user,
		loginUserJs: JSON.stringify(req.session.user),
		user: findUser,
		activeTab,
	};
	res.render('profile', Payload);
};
