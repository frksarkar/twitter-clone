const bcrypt = require('bcrypt');

const { throwError } = require('../util/helper');
const { generateAccessToken, generateRefreshToken } = require('../util/tokens');
const { User } = require('../model');
const { tokenConfig } = require('../config/defaultValue');

exports.postLogin = async function (req, res, next) {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) throwError('Invalid email or password', 401);

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) throwError('Invalid email or password', 401);

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Lax', maxAge: parseInt(tokenConfig.refreshTokenExpiration) });

		res.json({ status: 'success', message: 'Login successful', token: accessToken });
	} catch (error) {
		next(error);
	}
};
