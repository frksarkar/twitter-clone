exports.notFound = function (req, res, next) {
    const path = req.params.id
	const Payload = {
		pageTitle: path,
		loginUser: req.session.user,
		loginUserJs: JSON.stringify(req.session.user),
	};
	res.render('pageNotFound', Payload);
};
