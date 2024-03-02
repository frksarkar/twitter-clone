exports.getMessagePage = (req, res, next) => {
	const Payload = {
		pageTitle: 'Messages',
		loginUser: req.session.user,
		loginUserJs: JSON.stringify(req.session.user),
		logoActive: true,
	};
	res.render('inbox', Payload);
};

exports.getGroupMessagePage = (req, res, next) => {
	const Payload = {
		pageTitle: 'New messages',
		loginUser: req.session.user,
		loginUserJs: JSON.stringify(req.session.user),
	};
	res.render('newInbox', Payload);
};
