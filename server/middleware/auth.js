const { verifyToken } = require('../util/tokens');

exports.authMiddleware = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const cookieToken = req.cookies?.refreshToken;

	if (!authHeader || !cookieToken) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	const token = authHeader && authHeader.split(' ')[1];

	// decoded = {id: '5f92cdce0cf217478ba93563', email: example@email.com, name: 'John Doe'}
	const decoded = token ? verifyToken(token) : verifyToken(authHeader);

	if (!decoded) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	req.user = decoded;
	next();
};
