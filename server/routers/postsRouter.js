const express = require('express');
const post = require('../controller/postsController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const postRouter = express.Router();

/**
 * @openapi
 * /api/posts:
 *   post:
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     description: Create a new post
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
 *             required:
 *               - content
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
 *                   example: Post created successfully
 *                 newPost:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad Request
 */
postRouter.post('/', upload.array('images', 4), post.createPost);

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     description: get all the current user posts!
 *     parameters:
 *       - in: query
 *         name: isAuthor
 *         schema:
 *           type: enum
 *           enum: [true, false]
 *           default: false
 *         description: The author of the post
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: The username of the post author
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search for a post by content
 *       - in: query
 *         name: isReply
 *         schema:
 *           type: enum
 *           enum: [true, false]
 *         description: Search for a post by content
 *       - in: query
 *         name: isFollowing
 *         schema:
 *           type: enum
 *           enum: [true, false]
 *         description: Search for a post by content
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: The cursor to start from
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: The number of posts per page
 *     responses:
 *       200:
 *         description: Returns a list of user posts.
 *         content:
 *          application/json:
 *           schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                content:
 *                  type: string
 *                media:
 *                  type: string
 *                author:
 *                  $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 */
postRouter.get('/', post.getAllPosts);

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     description: Get a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         format: uuid
 *         example: '6832cb516475f3c6155465a3'
 *         description: The ID of the post
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 *       404:
 *         description: Post not found
 *       400:
 *         description: Bad Request
 *
 */
postRouter.get('/:id', post.getPost);

/**
 * @openapi
 * /api/posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     description: delete a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         format: uuid
 *         example: '6832cb516475f3c6155465a3'
 *         description: The ID of the post to delete
 *         required: true
 *     responses:
 *       200:
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
 *                   example: Post deleted successfully
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Post'
 *         description: Post updated successfully
 *       400:
 *         description: Bad Request
 */
postRouter.delete('/:id', post.deletePost);

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

// postRouter.post('/:id/reply', upload.array('images', 4), post.replyPost);

/**
 * @openapi
 * /api/posts/{id}/tweet:
 *  post:
 *    tags:
 *      - Posts
 *    security:
 *      - bearerAuth: []
 *    description: Retweet a post by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the post to retweet
 *        schema:
 *          type: string
 *          example: '6832cb516475f3c6155465a3'
 */
postRouter.post('/:id/retweet', post.retweetPost);

/**
 * @openapi
 * /api/posts/{id}/like:
 *  put:
 *    tags:
 *      - Posts
 *    security:
 *      - bearerAuth: []
 *    description: Like a post by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the post to like
 *        schema:
 *          type: string
 *          example: '6832cb516475f3c6155465a3'
 *    responses:
 *      200:
 *        description: Post updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: success
 *                message:
 *                  type: string
 *                  example: user like your post
 */
postRouter.put('/:id/like', post.updateLike);

/**
 * @openapi
 * /api/posts/{id}/pinned:
 *  put:
 *    tags:
 *      - Posts
 *    security:
 *      - bearerAuth: []
 *    description: Pin a post by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the post to pin
 *        schema:
 *          type: string
 *          example: '6832cb516475f3c6155465a3'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              pinned:
 *                type: boolean
 *                example: true
 *                description: The pinned status of the post
 *    responses:
 *      200:
 *        description: Post updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: success
 *                message:
 *                  type: string
 *                  example: pin post successfully
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: failed
 *                message:
 *                  type: string
 *                  example: You don't have permission to pin this post
 */
postRouter.put('/:id/pinned', post.pinnedPost);

// auth user get all like own his posts

module.exports = postRouter;
