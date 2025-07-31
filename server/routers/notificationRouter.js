const express = require('express');
const notification = require('../controller/notificationController');
const { payloadHandler } = require('../middleware/payload');

const notificationRouter = express.Router();

notificationRouter.get('/', payloadHandler('Notifications'), notification.getNotificationPage);

/**
 * @openapi
 * /notifications/all:
 *    get:
 *      tags:
 *        - Notifications
 *      security:
 *        - bearerAuth: []
 *      description: Get all notifications
 *      responses:
 *        200:
 *          description: A list of notifications
 */
notificationRouter.get('/all', notification.getAllNotification);

/**
 * @openapi
 * /notifications/{id}:
 *    get:
 *      tags:
 *        - Notifications
 *      security:
 *        - bearerAuth: []
 *      description: open a specific notification by ID
 *      parameters:
 *        - in: path
 *          name: id
 *          type: string
 *          example: '5f92cdce0cf217478ba93563'
 *          required: true
 *          description: The ID of the notification to retrieve
 *      responses:
 *        200:
 *          description: A single notification object
 */
notificationRouter.put('/:id', notification.notificationUpdate);

module.exports = notificationRouter;
