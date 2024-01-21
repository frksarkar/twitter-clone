exports.errorHandler = function (err, req, res, next) {
	console.log(err.message, err.statusCode);
	res.status(err.statusCode).json({
		status: 'failed',
		message: err.message,
	});
};
