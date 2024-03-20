const { Schema, model } = require('mongoose');

const notification = new Schema(
	{
		userForm: { type: Schema.Types.ObjectId, ref: 'User', require: true },
		userTo: { type: Schema.Types.ObjectId, ref: 'User', require: true },
		notificationType: { type: String, require: true },
		opened: { type: Boolean, default: false },
		entryId: Schema.Types.ObjectId,
	},
	{ timestamps: true }
);

notification.statics.insertNotification = async (notificationObj) => {
	await this.Notification.deleteOne(notificationObj).catch((err) =>
		console.log(err)
	);
	return this.Notification.create(notificationObj).catch((error) => {
		console.log(error);
	});
};

notification.statics.removeNotification = async (notificationObj) => {
	return await this.Notification.deleteOne(notificationObj);
};

exports.Notification = model('Notification', notification);
