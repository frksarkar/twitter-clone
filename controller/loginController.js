exports.viewLoginForm = function (req, res, next) {
	res.render('login');
};

exports.redirectToLogin = function (req, res, next) {
	res.render('main-page');
	// res.redirect('/login');
};
