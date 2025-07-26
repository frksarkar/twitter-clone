const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Token } = require('../model/tokenSchema');
require('dotenv').config();
const { JWT_SECRET, JWT_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = process.env;

const generateAccessToken = (user) => {
	const payload = {
		id: user._id,
		email: user.email,
		name: user.name,
	};

	try {
		const token = jwt.sign(payload, JWT_SECRET, {
			expiresIn: JWT_EXPIRATION,
		});
		return token;
	} catch (error) {
		return null;
	}
};

const generateRefreshToken = (user) => {
	try {
		const token = uuidv4(); // Generate a unique refresh token
		const refreshToken = jwt.sign({ token }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

		// Store the refresh token in the database
		Token.create({ userId: user._id, token: refreshToken });

		return refreshToken;
	} catch (error) {
		return null;
	}
};

const invalidateRefreshToken = (refreshToken) => {
	// Remove the refresh token from memory
	try {
		const token = Token.findOneAndDelete({ token: refreshToken });
		return token;
	} catch (error) {
		return null;
	}
};

const getUserFromRefreshToken = async (refreshToken) => {
	// Retrieve the user ID associated with the refresh token
	try {
		const token = await Token.findOne({ token: refreshToken });

		if (!token) {
			return null;
		}

		return token.userId;
	} catch (error) {
		return null;
	}
};

const isValidRefreshToken = async (refreshToken) => {
	// Check if the refresh token exists in memory
	try {
		const token = await Token.findOne({ token: refreshToken });

		if (!token) {
			return false;
		}

		return token.userId;
	} catch (error) {
		return false;
	}
};

const verifyToken = (token) => {
	if (!token) return null;

	try {
		// Verify the token and return the decoded payload
		const decoded = jwt.verify(token, JWT_SECRET);

		return decoded;
	} catch (error) {
		return null; // Return null if verification fails
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
