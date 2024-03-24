const mongoose = require('mongoose');
const { User } = require('../module/userSchema');

exports.getProfile = async (req, res, next) => {
	const profileIdAndName = req.params.id;
	let activeTab = 'post';
	if (req.query.tab == 'replies') {
		activeTab = 'replies';
	}

	let findUser = await User.findOne({ userName: profileIdAndName });
	const isObjId = mongoose.isValidObjectId(profileIdAndName);
	if (isObjId) {
		findUser = await User.findOne({ _id: profileIdAndName });
	}

	const payload = {
		user: findUser,
		activeTab,
	};
	res.render('profile', payload);
};
