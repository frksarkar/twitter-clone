const { User } = require('../model');
const { throwError } = require('../util/helper');

exports.viewRegisterForm = function (req, res, next) {
	res.render('register');
};

exports.postRegisterForm = async function (req, res, next) {
	const { name, username, email, password } = req.body;

	try {
		if (!(name && username && email && password)) {
			throwError('all fields are required', 400);
		}

		const existAccount = await User.findOne({ $or: [{ email }, { username }] });
		if (existAccount) {
			throwError('account already exists', 400);
		}
		const newUser = await User.create({ name, username, email, password });
		if (!newUser) {
			throwError('account creation failed', 500);
		}

		res.status(201).json({
			status: 'success',
			message: 'user created successfully',
			data: newUser,
		});
	} catch (error) {
		next(error);
	}
};
