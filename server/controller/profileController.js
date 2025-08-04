const { User } = require('../model');
const { throwError } = require('../util/helper');

exports.getProfile = async (req, res, next) => {
	const profileId = req.user.id;

	try {
		const user = await User.findById(profileId).select('-password -__v');
		if (!user) {
			throwError('User not found', 404);
		}

		res.status(200).json({
			status: 'success',
			data: user,
		});
	} catch (error) {
		next(error);
	}
};
