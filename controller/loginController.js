const bcrypt = require('bcrypt');

const { User } = require('../module/userSchema');
const { throwError } = require('../util/helper');

exports.viewLoginForm = function (req, res, next) {
	res.render('login');
};

exports.postLogin = async function (req, res, next) {
	try {
		const { email, password } = req.body;
		let user = await User.findOne({ email });
		if (!user) {
			throwError('User not found', 400);
		}
		const isVerify = await bcrypt.compare(password, user.password);
		if (!isVerify) {
			throwError('Password is incorrect', 400);
		}

		if (!(req.session && req.session.user)) {
			req.session.user = user;
		}
		res.redirect('/')
	} catch (error) {
		next(error);
	}
};
