const { Schema, model } = require('mongoose');

const notificationSchema = new Schema(
	{
		userFrom: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		userTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		type: { type: String, required: true },
		targetId: { type: Schema.Types.ObjectId, required: true },
		text: { type: String, default: '' },
		opened: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

notificationSchema.statics.insertNotification = async (notificationObj) => {
	await this.Notification.deleteOne(notificationObj).catch((err) => {
		throw new Error(err);
	});
	return await this.Notification.create(notificationObj).catch((err) => {
		throw new Error(err);
	});
};

notificationSchema.statics.removeNotification = async (notificationObj) => {
	return await this.Notification.deleteOne(notificationObj).catch((err) => {
		throw new Error(err);
	});
};

const Notification = model('Notification', notificationSchema);

exports.Notification = Notification;
