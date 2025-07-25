const bcrypt = require('bcrypt');
const { Notification } = require('../model/notificationSchema');

exports.throwError = (message, statusCode) => {
	const error = new Error(message);
	error.status = statusCode;
	throw error;
};

exports.passwordHash = async function (next) {
	const hashPassword = await bcrypt.hash(this.password, 12);
	this.password = hashPassword;
	next();
};

exports.notify = async function (senderId, receiverId, notificationType, messageText = '', targetResourceId, isRemoveNotification) {
	const notificationData = {
		userFrom: senderId,
		userTo: receiverId,
		targetId: targetResourceId,
		type: notificationType,
		text: messageText,
	};

	isRemoveNotification ? Notification.removeNotification(notificationData) : Notification.insertNotification(notificationData);
};
