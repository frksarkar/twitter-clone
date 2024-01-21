const { User } = require('../module/userSchema');
const { throwError } = require('../util/helper');

exports.viewRegisterForm = function (req, res, next) {
	res.render('register');
};

exports.postRegisterForm = async function (req, res, next) {
	const { userName, email, password } = req.body;
	try {
		if (!(userName && email && password)) {
			throwError('all fields are required', 400);
		}

		const existAccount = await User.findOne({ email });
		if (!existAccount) {
			throwError('account already exists', 400);
		}
		
		const newUser = await User.create({ userName, email, password });
		if (!newUser) {
			throwError('account creation failed', 500);
		}
		res.status(201).json({
			status: 'success',
			message: 'user created successfully',
		});
	} catch (error) {
		next(error);
	}
};
