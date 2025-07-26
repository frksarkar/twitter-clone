const { Schema, model } = require('mongoose');

const replySchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
	media: [String],
	timestamp: { type: Date, default: Date.now },
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	parentTweetId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
	parentReplyId: { type: Schema.Types.ObjectId, ref: 'Reply' },
});

const Reply = model('Reply', replySchema);

module.exports = Reply;
