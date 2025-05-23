const express = require('express');
const inbox = require('../controller/inboxController');
const { payloadHandler } = require('../middleware/payload');

const inboxRouter = express.Router();

inboxRouter.get('/', payloadHandler('Messages'), inbox.getMessagePage);

inboxRouter.get(
	'/new',
	payloadHandler('New messages'),
	inbox.getGroupMessagePage
);

exports.inboxRouter = inboxRouter;
