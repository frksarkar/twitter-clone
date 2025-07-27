const { throwError } = require('../util/helper');
const { invalidateRefreshToken, verifyToken } = require('../util/tokens');

exports.logout = async function (req, res, next) {
	const { refreshToken } = req.cookies;

	try {
		if (!refreshToken || !verifyToken(refreshToken)) {
			throwError('invalid refresh token', 403);
		}
		res.clearCookie('refreshToken');

		await invalidateRefreshToken(refreshToken);

		res.status(200).json({ status: 'success', message: 'Logout successful' });
	} catch (error) {
		return next(error);
	}
};
