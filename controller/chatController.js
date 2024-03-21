const { default: mongoose } = require('mongoose');
const { Chat } = require('../module/chatSchema');
const { throwError } = require('../util/helper');
const { User } = require('../module/userSchema');

exports.getChatPage = async (req, res, next) => {
	const loginUserId = req.session.user._id;
	let chatId = req.params.id;

	try {
		if (!(loginUserId && chatId)) throwError('invalid chat id', 401);

		const isValidId = mongoose.isValidObjectId(chatId);
		if (!isValidId) throwError("can't access this chat", 401);

		const messages = await Chat.findOne({
			_id: chatId,
			users: { $elemMatch: { $eq: loginUserId } },
		}).populate({ path: 'users', select: '-password' });

		if (!messages) {
			const user = await User.findById(chatId);
			if (!user) throwError('chat not found', 500);
			const chat = await createNewChat(chatId, loginUserId);
			chatId = chat._id;
		}
		res.render('chatPage', { messages });
	} catch (error) {
		console.log('🚀 ~ file: chatController.js:11 ~ error:', error);
	}
};

exports.getMessage = async (req, res, next) => {
	const loginUserId = req.session.user._id;
	const notifying = req.query.notifying;
	let chats = await Chat.find({
		users: loginUserId,
	})
		.sort({ updatedAt: -1 })
		.populate({
			path: 'users',
			select: '-password',
		})
		.populate({ path: 'latestMessage', populate: { path: 'sender' } });

	if (notifying) {
		const unreadChats = chats.filter(
			(chat) =>
				chat.latestMessage &&
				!chat.latestMessage.readBy.includes(loginUserId)
		);
		chats = { notifications: unreadChats.length };
	}

	res.status(200).json(chats);
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

function createNewChat(chatId, loginUserId) {
	return Chat.findByIdAndUpdate(
		{
			_id: chatId,
			users: {
				$size: 2,
				$elemMatch: { $eq: chatId },
				$elemMatch: { $eq: loginUserId },
			},
		},
		{
			createdBy: loginUserId,
			$setOnInsert: { users: [chatId, loginUserId] },
		},
		{ new: true, upsert: true }
	);
}

exports.updateChat = async (req, res, next) => {
	const loginUserId = req.session.user._id;
	const chatName = req.body.chatName;
	const chatId = req.params.id;

	try {
		const isValidId = mongoose.isValidObjectId(chatId);
		if (!isValidId) throwError('chat id invalid', 403);

		const chatData = await Chat.findOneAndUpdate(
			{
				_id: chatId,
				users: loginUserId,
			},
			{ chatName }
		);
		console.log(
			'🚀 ~ file: chatController.js:95 ~ exports.updateChat= ~ chatData:',
			chatData
		);
		res.status(200).json({ status: 'success' });
	} catch (error) {
		console.log('🚀 ~ file: chatController.js:89 ~ error:', error);
	}
};
