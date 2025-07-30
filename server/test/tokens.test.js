const {
	generateAccessToken,
	verifyToken,
	generateRefreshToken,
	getUserFromRefreshToken,
	isValidRefreshToken,
	invalidateRefreshToken,
} = require('../util/tokens');

describe('JWT Token Generation and Verification', () => {
	const testUser = {
		_id: '12345',
		email: 'TqT0S@example.com',
	};

	it('should generate a valid JWT token', () => {
		const token = generateAccessToken(testUser);
		expect(token).toBeDefined();
	});

	it('should verify a valid JWT token', () => {
		const token = generateAccessToken(testUser);
		const decoded = verifyToken(token);
		expect(decoded).toBeDefined();
		expect(decoded.id).toEqual(testUser._id);
		expect(decoded.email).toEqual(testUser.email);
	});

	it('should generate a valid refresh token', () => {
		const token = generateRefreshToken(testUser);
		expect(token).toBeDefined();
	});

	it('should verify a valid refresh token', () => {
		const token = generateRefreshToken(testUser);
		const isValid = isValidRefreshToken(token);
		expect(isValid).toBe(true);
	});

	it('should invalidate a refresh token', () => {
		const token = generateRefreshToken(testUser);
		invalidateRefreshToken(token);
		const isValid = isValidRefreshToken(token);
		expect(isValid).toBe(false);
	});

	it('should retrieve user from refresh token', () => {
		const token = generateRefreshToken(testUser);
		const userId = getUserFromRefreshToken(token);
		expect(userId).toEqual(testUser._id);
	});

	it('should not verify an invalid JWT token', () => {
		const invalidToken = 'invalid.token.here';
		const decoded = verifyToken(invalidToken);
		expect(decoded).toBeNull();
	});

	it('check if refresh token is valid', () => {
		const token = generateRefreshToken(testUser);
		const isValid = isValidRefreshToken(token);
		expect(isValid).toBe(true);
	});
});
