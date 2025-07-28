const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Token } = require('../model/tokenSchema');
require('dotenv').config();
const { JWT_SECRET, JWT_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = process.env;

const generateAccessToken = (user) => {
	try {
		const payload = {
			id: user._id,
			email: user.email,
			name: user.name,
		};

		const options = { expiresIn: JWT_EXPIRATION };

		return jwt.sign(payload, JWT_SECRET, options);
	} catch (error) {
		console.error('Error generating access token:', error);
		return null;
	}
};

const generateRefreshToken = (user) => {
	const refreshTokenId = uuidv4();
	const refreshToken = jwt.sign({ refreshTokenId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

	Token.create({ userId: user._id, token: refreshToken });
	return refreshToken;
};

const invalidateRefreshToken = async (refreshToken) => {
	await Token.findOneAndDelete({ token: refreshToken }).exec();
};

const getUserFromRefreshToken = async (refreshToken) => (await Token.findOne({ token: refreshToken }))?.userId ?? null;

const isValidRefreshToken = async (refreshToken) => {
	try {
		const token = await Token.findOne({ token: refreshToken }).lean().select('userId').exec();
		return token ? token.userId : false;
	} catch (error) {
		console.log('🚀 ~ tokens.js:81 ~ isValidRefreshToken ~ error:', error);
		return false;
	}
};

const verifyToken = (token) => {
	if (!token) return null;

	try {
		const payload = jwt.verify(token, JWT_SECRET);
		return payload;
	} catch {
		return null;
	}
};

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	invalidateRefreshToken,
	getUserFromRefreshToken,
	isValidRefreshToken,
	verifyToken,
};
