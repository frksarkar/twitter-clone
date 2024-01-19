const bcrypt = require('bcrypt');

exports.throwError = function (message, statusCode) {
	const error = new Error(message);
	error.statusCode = statusCode;
	throw error;
};

exports.passwordHash = async function (next) {
	const hashPassword = await bcrypt.hash(this.password, 12);
	this.password = hashPassword;
	next();
};
