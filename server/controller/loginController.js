const bcrypt = require('bcrypt');

const { throwError } = require('../util/helper');
const { generateAccessToken, generateRefreshToken } = require('../util/tokens');
const { User } = require('../model');

exports.postLogin = async function (req, res, next) {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			throwError('Invalid email or password', 401);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throwError('Invalid email or password', 401);
		}

		const accessToken = generateAccessToken(user);

		const refreshToken = generateRefreshToken(user);

		// Set maxAge for refreshToken cookie to align with refresh token's expiration
		const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms, adjust as needed
		res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Lax', maxAge: refreshTokenMaxAge });

		res.json({ status: 'success', message: 'Login successful', token: accessToken });
	} catch (error) {
		next(error);
	}
};
