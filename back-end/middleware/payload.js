exports.payloadHandler = (pageName) => {
	return (req, res, next) => {
		res.locals.pageTitle = pageName;
		res.locals.loginUser = req.session.user;
		res.locals.loginUserJs = JSON.stringify(req.session.user);
		next();
	};
};
