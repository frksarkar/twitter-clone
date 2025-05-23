const express = require('express');
const chat = require('../controller/chatController');
const { payloadHandler } = require('../middleware/payload');

const chatRouter = express.Router();

chatRouter.get('/', chat.getMessage);

chatRouter.post('/create', chat.createChat);

chatRouter.get('/:id', payloadHandler('Chat'), chat.getChatPage);

chatRouter.put('/:id', payloadHandler('Chat'), chat.updateChat);

exports.chatRouter = chatRouter;
