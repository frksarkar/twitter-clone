const { Chat } = require('../module/chatSchema');

exports.createChat = async (req, res, next) => {
	const userId = req.session?.user._id;

	try {
		if (!req.body?.length) throw new Error('provide user id');

		const chatObj = {
			createdBy: userId,
			users: req.body,
			isGroupChat: true,
		};
		const createChat = await Chat.create(chatObj);

		res.status(201).json(createChat);
	} catch (error) {
		console.log('🚀 ~ file: chatController.js:16 ~ error:', error);
	}
};
