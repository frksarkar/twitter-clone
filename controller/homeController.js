exports.homePage = async function (req, res, next) {
	const Payload = {
		pageTitle: 'Home',
		loginUser: req.session.user,
		loginUserJs: JSON.stringify(req.session.user),
	};
	res.render('home', Payload);
};
