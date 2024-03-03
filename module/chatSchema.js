const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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

exports.Chat = mongoose.model('Chat', chatSchema);
