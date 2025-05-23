const express = require('express');
const home = require('../controller/homeController');
const { payloadHandler } = require('../middleware/payload');

const homeRouter = express.Router();

homeRouter.get('/', payloadHandler('Home'), home.homePage);

exports.homeRouter = homeRouter;
