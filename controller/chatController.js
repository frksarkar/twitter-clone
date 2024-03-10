const { Chat } = require('../module/chatSchema');

exports.getChats = (req, res, next) => {
	res.render('chatPage');
};

exports.getMessage = async (req, res, next) => {
	const loginUserId = req.session.user._id;
	const messages = await Chat.find({
		users: loginUserId,
	})
		.sort({ createdAt: -1 })
		.populate({ path: 'users', select: '-password' });

	res.status(200).json(messages);
};

exports.createChat = async (req, res, next) => {
	const loginUserId = req.session?.user._id;
	const usersId = req.body;

	try {
		if (!usersId?.length) throw new Error('provide user id');
		usersId.push(loginUserId);
		const chatObj = {
			createdBy: loginUserId,
			users: usersId,
			isGroupChat: true,
		};
		const createChat = await Chat.create(chatObj);

		res.status(201).json(createChat);
	} catch (error) {
		console.log('🚀 ~ file: chatController.js:16 ~ error:', error);
	}
};
