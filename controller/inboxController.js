exports.getMessagePage = (req, res, next) => {
	const Payload = {
		logoActive: true,
	};
	res.render('inbox', Payload);
};

exports.getGroupMessagePage = (req, res, next) => {
	res.render('newInbox');
};
