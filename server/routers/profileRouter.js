const express = require('express');
const profile = require('../controller/profileController');

const profileRouter = express.Router();

/**
 * @openapi
 * /profile:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Get the profile of the logged-in user
 *
 *     responses:
 *       200:
 *         description: The profile of the logged-in user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *
 */

profileRouter.get('/', profile.getProfile);

module.exports = profileRouter;
