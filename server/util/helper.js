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

exports.notify = function (sender, receiver, type, text, entry, isRemoved) {
	const notification = {
		userFrom: sender,
		userTo: receiver,
		targetId: entry,
		type,
		text: text || '',
	};

	const action = isRemoved ? 'removeNotification' : 'insertNotification';
	return Notification[action](notification);
};
