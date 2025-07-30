const express = require('express');
const login = require('../controller/loginController');

const loginRouter = express.Router();

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Login
 *     description: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: sarkar@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: test
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *               required:
 *                 - message
 *                 - accessToken
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized - User not found or password is incorrect
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                Status:
 *                  type: String
 *                  example: "failed"
 *                message:
 *                  type: string
 *                  example: "User not found or password is incorrect"
 *              required:
 *                - Status
 *                - message
 */
loginRouter.post('/', login.postLogin);

module.exports = loginRouter;
