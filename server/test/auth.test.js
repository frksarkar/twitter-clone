const { authMiddleware } = require('../middleware/auth');
const { verifyToken } = require('../util/tokens');

jest.mock('../util/tokens');

// Mock Express.js request, response, and next function
const createMockReq = () => {
	return {
		headers: { authorization: 'Bearer token' },
	};
};

const createMockRes = () => {
	return {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};
};

const createMockNext = () => jest.fn();

describe('authMiddleware', () => {
	let req;
	let res;
	let next;

	beforeEach(() => {
		req = createMockReq();
		res = createMockRes();
		next = createMockNext();
	});

	it('should call next if token is valid', () => {
		verifyToken.mockReturnValue({ id: 1 });
		authMiddleware(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	it('should return 401 if token is invalid', () => {
		verifyToken.mockReturnValue(null);
		authMiddleware(req, res, next);
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
	});
});
