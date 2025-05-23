const { Notification } = require('../module/notificationSchema');

exports.getNotificationPage = async (req, res, next) => {
	res.render('notificationPage');
};

exports.getAllNotification = async (req, res, next) => {
	const notify = req.query.notify;

	let allNotification;

	if (notify) {
		allNotification = await Notification.find({
			userTo: req.loginUserId,
			opened: false,
		}).countDocuments();
	} else {
		allNotification = await Notification.find({
			userTo: req.loginUserId,
		})
			.sort({ opened: 1, updatedAt: -1 })
			.populate({ path: 'userForm', select: '-password' });
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
