const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		content: String,
		postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
		pinned: Boolean,
	},
	{ timestamps: true }
);

exports.Post = mongoose.model('Post', postSchema);
