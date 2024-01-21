const mongoose = require('mongoose');
const { passwordHash } = require('../util/helper');

const Schema = mongoose.Schema;

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
		like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

userSchema.pre('save', passwordHash);

exports.User = mongoose.model('User', userSchema);
