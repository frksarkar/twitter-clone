//	search post
exports.searchPostsPage = (req, res, next) => {
	const payload = info('posts', req.session.user);
	res.render('search', payload);
};

//	search users
exports.searchUsersPage = (req, res, next) => {
	const payload = info('users', req.session.user);
	res.render('search', payload);
};

//	send data to the page
function info(activeTab, userInfo) {
	return {
		pageTitle: 'Search',
		loginUser: userInfo,
		loginUserJs: JSON.stringify(userInfo),
		activeTab,
	};
}
