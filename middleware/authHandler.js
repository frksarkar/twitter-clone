exports.isLogin = function (req, res, next) {
	if (!(req.session && req.session.user)) {
		res.redirect('/login');
		return;
	}
	next();
};
