const express = require('express');
const notification = require('../controller/notificationController');
const { payloadHandler } = require('../middleware/payload');

const notificationRouter = express.Router();

notificationRouter.get(
	'/',
	payloadHandler('Notifications'),
	notification.getNotificationPage
);

notificationRouter.get('/all', notification.getAllNotification);

notificationRouter.put('/:id', notification.notificationUpdate);

exports.notificationRouter = notificationRouter;
