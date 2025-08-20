const { default: mongoose } = require('mongoose');
const { throwError } = require('../util/helper');
const { Chat, User } = require('../model');

exports.getChatPage = async (req, res, next) => {
	const loginUserId = req.session.user._id;
	let chatId = req.params.id;

	try {
		if (!(loginUserId && chatId)) throwError('invalid chat id', 401);

		const isValidId = mongoose.isValidObjectId(chatId);
		if (!isValidId) throwError("can't access this chat", 401);

		const messages = await Chat.findOne({
			_id: chatId,
			groupMembers: { $elemMatch: { $eq: loginUserId } },
		}).populate({ path: 'groupMembers', select: '-password' });

		if (!messages) {
			const user = await User.findById(chatId);
			if (!user) return res.status(404).json({ message: 'chat not found' });
			const chat = await createNewChat(chatId, loginUserId);
			chatId = chat._id;
		}
		res.render('chatPage', { messages });
	} catch (error) {
		next(error);
	}
};

exports.getMessage = async (req, res, next) => {
	const loginUserId = req.session.user._id;
	const notifying = req.query.notifying;
	let chats = await Chat.find({
		groupMembers: loginUserId,
	})
		.sort({ updatedAt: -1 })
		.populate({
			path: 'groupMembers',
			select: '-password',
		})
		.populate({ path: 'latestMessage', populate: { path: 'sender' } });

	if (notifying) {
		const unreadChats = chats.filter((chat) => chat.latestMessage && !chat.latestMessage.readBy.includes(loginUserId));
		chats = { notifications: unreadChats.length };
	}

	res.status(200).json(chats);
};

exports.createChat = async (req, res, next) => {
	const loginUserId = req.user.id;
	const groupMemberId = req.body;

	try {
		if (!groupMemberId?.length) throw new Error('provide user id');
		groupMemberId.push(loginUserId);
		const chatObj = {
			createdBy: loginUserId,
			groupMembers: groupMemberId,
			isGroupChat: true,
		};
		const createChat = await Chat.create(chatObj);

		res.status(201).json(createChat);
	} catch (error) {
		next(error);
	}
};

function createNewChat(chatId, loginUserId) {
	return Chat.findByIdAndUpdate(
		{
			_id: chatId,
			groupMembers: {
				$size: 2,
				$elemMatch: { $eq: chatId },
				$elemMatch: { $eq: loginUserId },
			},
		},
		{
			createdBy: loginUserId,
			$setOnInsert: { groupMembers: [chatId, loginUserId] },
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
				groupMembers: loginUserId,
			},
			{ chatName }
		);

		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};
