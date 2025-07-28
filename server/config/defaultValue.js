const defaultValue = {
	mongoURL: process.env.MONGODB_URL,
};

const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	databaseURL: process.env.DATABASE_URL,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
	firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

const tokenConfig = {
	jwtSecret: process.env.JWT_SECRET,
	jwtExpiration: process.env.JWT_EXPIRATION,
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
	refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
};

module.exports = { defaultValue, firebaseConfig, tokenConfig };
