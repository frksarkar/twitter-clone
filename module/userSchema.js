const { Schema, model } = require('mongoose');
const { passwordHash } = require('../util/helper');

const userSchema = new Schema(
	{
		userName: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		profilePicture: {
			type: String,
			required: true,
			default: 'https://i.pravatar.cc/300',
		},
		coverPicture: {
			type: String,
			required: true,
			default: 'https://i.pravatar.cc/300',
		},
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		retweet: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
		followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

userSchema.pre('save', passwordHash);

exports.User = model('User', userSchema);
