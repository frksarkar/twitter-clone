const express = require('express');
const inbox = require('../controller/inboxController');

const inboxRouter = express.Router();

inboxRouter.get('/', inbox.getMessagePage)

inboxRouter.get('/new', inbox.getGroupMessagePage)

exports.inboxRouter = inboxRouter;
