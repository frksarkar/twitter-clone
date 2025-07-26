const { Schema, model } = require('mongoose');
const { passwordHash } = require('../util/helper');

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		username: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		avatar: {
			type: String,
			required: true,
			default: 'https://i.pravatar.cc/300',
		},
		coverPicture: {
			type: String,
			required: true,
			default: 'https://i.pravatar.cc/300',
		},
		bio: { type: String, default: '' },
		location: { type: String, default: '' },
		website: { type: String, default: '' },
		phone: { type: String, default: '' },
		dateOfBirth: { type: Date, default: null },
		verified: { type: Boolean, default: false },
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		retweet: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
		followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
	},
	{ timestamps: true }
);

userSchema.pre('save', passwordHash);

const User = model('User', userSchema);

module.exports = User;
