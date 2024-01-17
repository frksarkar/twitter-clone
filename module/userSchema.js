const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		firstName: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		profilePicture: {
			type: String,
			required: true,
			default: 'https://i.pravatar.cc/300',
		},
	},
	{ timestamps: true }
);

exports.User = mongoose.model('User', userSchema);
