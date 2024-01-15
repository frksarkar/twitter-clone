exports.viewLoginForm = function (req, res, next) {
	res.render('login');
}

exports.redirectToLogin = function (req, res, next) {
    res.redirect('/login');
}