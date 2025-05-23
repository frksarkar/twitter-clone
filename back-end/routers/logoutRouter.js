const express = require('express');
const logout = require('../controller/logoutController');

const logoutRouter = express.Router();

logoutRouter.get('/', logout.logout)

exports.logoutRouter = logoutRouter;
