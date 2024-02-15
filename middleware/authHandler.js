exports.isLogin = function (req, res, next) {
	if (!(req.session && req.session.user)) {
		res.redirect('/login');
		return;
	}
	next();
};

exports.loginAuth = function (req, res, next) {
	if (!(req.session && req.session.user)) return next();
	res.redirect('/');
};
