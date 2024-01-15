const mongoose = require('mongoose');

const { mongoURL } = require('./defaultValue');

exports.dbConnection = async function (cb) {
	try {
		await mongoose.connect(mongoURL);
		console.log('database connection established');
		cb();
	} catch (error) {
		next(error);
	}
};
