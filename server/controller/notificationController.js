const { Notification } = require('../model');

exports.getNotificationPage = async (req, res, next) => {
	res.render('notificationPage');
};

exports.getAllNotification = async (req, res, next) => {
	const notify = req.query.notify;

	let allNotification;

	if (notify) {
		allNotification = await Notification.find({
			userTo: req.user.id,
			opened: false,
		}).countDocuments();
	} else {
		allNotification = await Notification.find({
			userTo: req.user.id,
		})
			.sort({ opened: 1, updatedAt: -1 })
			.populate({ path: 'userFrom', select: '_id name username avatar' });
	}

	res.status(200).json({ status: 'success', notifications: allNotification });
};

exports.notificationUpdate = async (req, res, next) => {
	const notificationId = req.params.id;

	await Notification.findByIdAndUpdate(notificationId, {
		opened: true,
	});

	res.status(200).json({ status: 'success' });
};
