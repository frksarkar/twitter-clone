const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		content: String,
		postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		pinned: Boolean,
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		retweetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		retweetData: { type: Schema.Types.ObjectId, ref: 'Post' },
		replayTo: { type: Schema.Types.ObjectId, ref: 'Post' },
		pinned: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

exports.Post = mongoose.model('Post', postSchema);
