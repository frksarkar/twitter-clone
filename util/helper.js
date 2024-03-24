const bcrypt = require('bcrypt');
const { Notification } = require('../module/notificationSchema');

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

exports.notify = function (sender, receiver, type, entry, isRemoved) {
	const notification = {
		userForm: sender,
		userTo: receiver,
		notificationType: type,
		entryId: entry,
	};
	const action = isRemoved ? 'remove' : 'insert';
	return Notification[action + 'Notification'](notification);
};
