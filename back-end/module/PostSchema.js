const { Schema, model } = require('mongoose');

const postSchema = new Schema(
	{
		content: String,
		postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		retweetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		retweetData: { type: Schema.Types.ObjectId, ref: 'Post' },
		replayTo: { type: Schema.Types.ObjectId, ref: 'Post' },
		pinned: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

exports.Post = model('Post', postSchema);
