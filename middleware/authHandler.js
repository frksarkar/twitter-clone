exports.isLogin = function (req, res, next) {
	if (!(req.session && req.session.user)) {
		res.redirect('/login');
		return;
	}
	req.loginUserId = req.session.user._id;
	next();
};

exports.loginAuth = function (req, res, next) {
	if (!(req.session && req.session.user)) return next();
	res.redirect('/');
};
