const express = require('express');
const router = express.Router();

const { authController } = require('../controller');

/** @openapi
 * /api/refresh-token:
 *   post:
 *     tags:
 *       - Login
 *     security:
 *       - bearerAuth: []
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
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
 *                   example: "Access token refreshed successfully"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE23NzI0IiwicmVtaW5kaW5nIjoiT3BlcmF0aW9uIiwiaWF0IjoxNTE2MjM5MDIyIiwicmVtaW5kaW5nIjoiT3BlcmF0aW9uIiwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 */
router.post('/refresh-token', authController.newRefreshToken);

module.exports = router;
