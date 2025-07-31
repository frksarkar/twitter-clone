const express = require('express');
const user = require('../controller/userController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRouter = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Get a list of users
 *     parameters:
 *       - in: query
 *         name: username
 *         type: string
 *         description: Search for users by their username
 *         required: true
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/', user.filteredUsers);

/**
 * @openapi
 * /users/likes:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Get a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/likes', user.getPostLikedByUsers);

const uploadMedia = upload.fields([
	{ name: 'avatar', maxCount: 1 },
	{ name: 'coverPicture', maxCount: 1 },
]);

userRouter.put('/update', uploadMedia, user.updateUser);

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         type: uuid
 *         required: true
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get('/:userId', user.getFollowerAndFollowing);

/**
 * @openapi
 * /users/{userId}/follow:
 *   put:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Follow a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         type: uuid
 *         required: true
 *         description: The ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 */
userRouter.put('/:userId/follow', user.getFollow);

userRouter.put('/replies/:replyId/like', user.updateRepliesLike);

/**
 * @openapi
 * /users/update/profile/image:
 *   put:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Update profile picture of a user
 *
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The new profile picture for the user
 *                 required: true
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: 'success'
 *                   message:
 *                     type: string
 *                     example: 'Profile picture updated successfully'
 *                   imageUrl:
 *                     type: string
 *                     example: 'https://example.com/avatar.jpg'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.put('/update/profile/image', upload.single('profilePicture'), user.profilePicUpdate, user.updatePicture);

/**
 * @openapi
 * /users/update/cover/image:
 *   put:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Update cover picture of a user by ID
 *
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverPicture:
 *                 type: string
 *                 format: binary
 *                 description: The new cover picture for the user
 *                 required: true
 *     responses:
 *       200:
 *         description: Cover picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: 'success'
 *                   message:
 *                     type: string
 *                     example: 'Cover picture updated successfully'
 *                   imageUrl:
 *                     type: string
 *                     example: 'https://example.com/cover.jpg'
 */
userRouter.put('/update/cover/image', upload.single('coverPicture'), user.coverPicUpdate, user.updatePicture);

module.exports = userRouter;
