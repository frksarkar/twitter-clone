const Chat = require('./chatSchema');
const Message = require('./messageSchema');
const User = require('./userSchema');
const Post = require('./PostSchema');
const Reply = require('./replySchema');
const { Notification } = require('./notificationSchema');

module.exports = {
	Chat,
	Message,
	User,
	Post,
	Reply,
	Notification,
};
