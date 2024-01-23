exports.homePage = async function (req, res, next) {
	res.render('main-page', { user: JSON.stringify(req.session.user) });
};
