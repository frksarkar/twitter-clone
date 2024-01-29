exports.logout = async function (req, res, next) {
	req.session.destroy();
	res.redirect('login');
};
