const { Schema, model } = require('mongoose');

const postSchema = new Schema(
	{
		content: { type: String },
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		retweetedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		retweetData: { type: Schema.Types.ObjectId, ref: 'Post' }, // optional
		replyTo: { type: Number, default: 0 },
		media: [String],
		pinned: { type: Boolean, default: false },
		verified: { type: Boolean, default: false },
		hashtags: [String],
		mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		visibility: { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
	},
	{ timestamps: true }
);

const Post = model('Post', postSchema);

module.exports = Post;
