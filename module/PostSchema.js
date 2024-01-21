const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		content: String,
		postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		pinned: Boolean,
		like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

exports.Post = mongoose.model('Post', postSchema);
