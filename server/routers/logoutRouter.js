const express = require('express');
const logout = require('../controller/logoutController');

const logoutRouter = express.Router();

/**
 * @openapi
 * /logout:
 *   get:
 *     tags:
 *       - Login
 *     security:
 *       - bearerAuth: []
 *     description: Logout user and invalidate refresh token
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       403:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: "failed"
 *                message:
 *                  type: string
 *                  example: "Invalid refresh token"
 */
logoutRouter.get('/', logout.logout);

module.exports = logoutRouter;
