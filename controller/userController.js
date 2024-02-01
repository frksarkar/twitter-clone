exports.getFollowerAndFollowing = function (req, res, next) {
    const userId = req.param.userId
	const { action } = req.query;
	console.log("🚀 ~ action:", action)
	const Payload = {
		pageTitle: action,
		loginUser: req.session.user,
		loginUserJs: JSON.stringify(req.session.user),
		activeTab: action,
	};
	res.render('followerAndFollowing', Payload);
};
