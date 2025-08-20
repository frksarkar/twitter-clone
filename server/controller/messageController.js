const { Chat, Message } = require('../model');
const { throwError, notify } = require('../util/helper');

exports.createMessage = async (req, res, next) => {
	const chatId = req.params.chatId;
	const content = req.body.content;
	const loginUserId = req.loginUserId;

	const messageObj = {
		chat: chatId,
		content,
		sender: loginUserId,
	};

	try {
		if (!(chatId && content)) {
			throwError('provided valid id and content', 400);
		}

		let message = await Message.create(messageObj);
		message = await Message.populate(message, { path: 'sender' });
		message = await Message.populate(message, { path: 'chat' });

		const chat = await Chat.findOneAndUpdate({ _id: chatId, groupMembers: loginUserId }, { latestMessage: message }, { new: true });

		//	send notification
		notification(chat, message);

		res.status(201).json({ starts: 'success', message });
	} catch (error) {
		next(error);
	}
};

exports.getAllMessages = async (req, res, next) => {
	const chatId = req.params.chatId;
	try {
		const messages = await Message.find({
			chat: chatId,
		}).populate({
			path: 'sender',
			select: '-password',
		});
		res.status(200).json({ status: 'success', messages });
	} catch (error) {
		next(error);
	}
};

function notification(chat, message) {
	chat.users.forEach(async (userId) => {
		if (userId.toString() === message.sender._id.toString()) return;
		await notify(message.sender._id, userId, 'message', `${message.sender.username} sent you a message`, chat._id, false);
	});
}
