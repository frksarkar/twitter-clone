const { Schema, model } = require('mongoose');

const chatSchema = new Schema(
	{
		chatName: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
	},
	{ timestamps: true }
);

exports.Chat = model('Chat', chatSchema);
