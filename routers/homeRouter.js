const express = require('express');
const home = require('../controller/homeController');

const homeRouter = express.Router();

homeRouter.get('/', home.homePage);

exports.homeRouter = homeRouter;
