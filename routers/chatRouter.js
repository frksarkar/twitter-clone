const express = require('express');
const chat = require('../controller/chatController');

const chatRouter = express.Router();

chatRouter.post('/create', chat.createChat);

exports.chatRouter = chatRouter;