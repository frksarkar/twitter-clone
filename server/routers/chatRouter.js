const express = require('express');
const chat = require('../controller/chatController');
const { payloadHandler } = require('../middleware/payload');

const chatRouter = express.Router();

/**
 * @openapi
 * /api/chat:
 *   get:
 *     tags:
 *       - Chats
 *     description: Get all chats for the logged-in user
 *     responses:
 *       200:
 *         description: A list of chats
 */
chatRouter.get('/', chat.getMessage);

/**
 * @openapi
 * /api/chat/create:
 *   post:
 *     tags:
 *       - Chats
 *     description: Create a new chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: '5f92cdce0cf217478ba93563'
 *                 description: The ID of the user to chat with
 *     responses:
 *       201:
 *         description: Chat created successfully
 */
chatRouter.post('/create', chat.createChat);

/**
 * @openapi
 * /api/chat/{id}:
 *   get:
 *     tags:
 *       - Chats
 *     description: Get a specific chat by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         format: uuid
 *         example: '65bf919c0e72c182e32372e0'
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chat to retrieve
 *     responses:
 *       200:
 *         description: Chat details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 */
chatRouter.get('/:id', payloadHandler('Chat'), chat.getChatPage);

/**
 * @openapi
 * /api/chat/{id}:
 *   put:
 *     tags:
 *       - Chats
 *     description: Update a specific chat name by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         format: uuid
 *         example: '65bf919c0e72c182e32372e0'
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chat to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatName:
 *                 type: string
 *                 description: The new name for the chat
 *     responses:
 *       200:
 *         description: Chat updated successfully
 */
chatRouter.put('/:id', payloadHandler('Chat'), chat.updateChat);

module.exports = chatRouter;
