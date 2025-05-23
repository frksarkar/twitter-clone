const { Chat } = require('../module/chatSchema');
const { Message } = require('../module/messageSchema');
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

		const chat = await Chat.findOneAndUpdate(
			{ _id: chatId, users: loginUserId },
			{ latestMessage: message },
			{ new: true }
		);

		//	send notification
		notification(chat, message);

		res.status(201).json({ starts: 'success', message });
	} catch (error) {
		console.log(
			'🚀 ~ file: messageController.js:8 ~ exports.createMessage= ~ error:',
			error
		);
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
		console.log(
			'🚀 ~ file: messageController.js:42 ~ exports.getAllMessages= ~ error:',
			error
		);
	}
};

function notification(chat, message) {
	chat.users.forEach(async (userId) => {
		if (userId.toString() === message.sender._id.toString()) return;
		await notify(message.sender._id, userId, 'message', chat._id, false);
	});
}
