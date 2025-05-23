exports.errorHandler = function (err, req, res, next) {
	console.log('🚀 ~ file: errorHandler.js:2 ~ err:', err);
	res.status(err.statusCode || 500).json({
		status: 'failed',
		message: err.message,
	});
};
