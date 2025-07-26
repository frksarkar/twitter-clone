const { authMiddleware } = require('./auth');
const { errorHandler } = require('./errorHandler');
const { notFound } = require('./notFoundHandler');

module.exports = {
	authMiddleware,
	errorHandler,
	notFound,
};
