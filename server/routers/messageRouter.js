const express = require('express');
const message = require('../controller/messageController');

const messageRouter = express.Router();

messageRouter.post('/:chatId', message.createMessage);

messageRouter.get('/:chatId', message.getAllMessages);

exports.messageRouter = messageRouter;
