const express = require('express');
const message = require('../controller/messageController');

const messageRouter = express.Router();

/**
 * @swagger
 * /message/{chatId}:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Create a new message
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         type: string
 *         format: uuid
 *         example: '5f92cdce0cf217478ba93563'
 *         required: true
 *         description: The ID of the chat to which the message belongs
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Chat not found
 */
messageRouter.post('/:chatId', message.createMessage);

/**
 * @swagger
 * /message/{chatId}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get all messages for a chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         type: string
 *         format: uuid
 *         example: '5f92cdce0cf217478ba93563'
 *         required: true
 *         description: The ID of the chat for which to retrieve messages
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       404:
 *         description: Chat not found
 */
messageRouter.get('/:chatId', message.getAllMessages);

module.exports = messageRouter;
