const express = require('express');
const repliesRouter = express.Router();
const multer = require('multer');
const replies = require('../controller/repliesController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @openapi
 * /api/replies:
 *   get:
 *     tags:
 *       - replies
 *     security:
 *       - bearerAuth: []
 *     description: Get all replies
 *     responses:
 *       200:
 *         description: A list of replies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reply'
 *       400:
 *         description: Bad Request
 */

repliesRouter.get('/', replies.getUserReplies);

repliesRouter.get('/:id', replies.getReplies);

/**
 * @openapi
 * /api/replies/post/{id}:
 *   get:
 *     tags:
 *       - replies
 *     security:
 *       - bearerAuth: []
 *     description: Get replies for a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: A list of replies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reply'
 *       400:
 *         description: Bad Request
 */

repliesRouter.get('/post/:id', replies.getPostReplies);

/**
 * @openapi
 * /api/posts/reply:
 *   post:
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     description: Create a reply post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: 'Hello, world!'
 *                 description: The content of the post
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The URL of the media associated with the post
 *               replyTo:
 *                 type: string
 *                 format: uuid
 *                 example: '5f92cdce0cf217478ba93563'
 *                 description: The original post that this is replying to.
 *             required:
 *               - content
 *               - replyTo
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: comment created successfully
 *                 comment:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad Request
 */

repliesRouter.post('/post/:id', upload.array('images', 4), replies.createReply);

/**
 * @openapi
 * /api/replies/{id}:
 *   delete:
 *     tags:
 *       - replies
 *     security:
 *       - bearerAuth: []
 *     description: Delete a reply
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the reply
 *     responses:
 *       200:
 *         description: Reply deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Reply deleted successfully
 *       400:
 *         description: Bad Request
 */

repliesRouter.delete('/:id', replies.deleteReply);

module.exports = repliesRouter;
