const { Schema, model } = require('mongoose');

const chatSchema = new Schema(
	{
		chatName: { type: String },
		isGroupChat: { type: Boolean, default: false },
		groupImage: { type: String },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		groupMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
	},
	{ timestamps: true }
);

const Chat = model('Chat', chatSchema);

module.exports = Chat;
