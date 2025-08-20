exports.errorHandler = function (err, req, res, next) {
	console.log(err);
	res.status(err.status || 500).json({
		status: 'failed',
		message: err.message,
	});
};
