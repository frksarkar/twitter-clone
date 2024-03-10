const express = require('express');
const profile = require('../controller/profileController');
const { payloadHandler } = require('../middleware/payload');

const profileRouter = express.Router();

profileRouter.get('/:id', payloadHandler('Profile'), profile.getProfile);

exports.profileRouter = profileRouter;
