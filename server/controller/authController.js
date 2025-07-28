const { tokenConfig } = require('../config/defaultValue');
const { User } = require('../model/userSchema');
const { throwError } = require('../util/helper');
const { generateAccessToken, generateRefreshToken, invalidateRefreshToken, isValidRefreshToken } = require('../util/tokens');

exports.newRefreshToken = async function (req, res, next) {
	// get set cookie value
	const { refreshToken } = req.cookies;

	if (!refreshToken) {
		return throwError({ status: 401, message: 'Refresh token not found' });
	}

	try {
		const userId = await isValidRefreshToken(refreshToken);

		if (!userId) {
			return throwError({ status: 401, message: 'Invalid refresh token' });
		}

		const user = await User.findById(userId);

		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user);

		res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: tokenConfig.refreshTokenExpiration });

		// Invalidate the old refresh token
		invalidateRefreshToken(refreshToken);
		res.json({ status: 'success', message: 'Refresh token updated', accessToken: newAccessToken });
	} catch (error) {
		next(error);
	}
};
