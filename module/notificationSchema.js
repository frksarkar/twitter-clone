const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notification = new Schema(
	{
		userForm: { type: Schema.Types.ObjectId, require: true },
		userTo: { type: Schema.Types.ObjectId, require: true },
		notificationType: { type: String, require: true },
		opened: { type: Boolean, default: false },
		entryId: Schema.Types.ObjectId,
	},
	{ timestamps: true }
);

exports.Notification = mongoose.model('Notification', notification);
