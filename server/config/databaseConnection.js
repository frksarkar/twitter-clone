const mongoose = require('mongoose');
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

const { defaultValue, firebaseConfig } = require('./defaultValue');

exports.dbConnection = async function (cb) {
	try {
		await mongoose.connect(defaultValue.mongoURL);
		console.log('database connection established');
		cb();
	} catch (error) {
		console.log('🚀 ~ file: databaseConnection.js:13 ~ error:', error);
	}
};

// firebase configuration
const firebaseApp = initializeApp(firebaseConfig);
exports.firebaseStorage = getStorage(firebaseApp);
