const express = require('express');
const profile = require('../controller/profileController');

const profileRouter = express.Router();

profileRouter.get('/:id', profile.getProfile);

exports.profileRouter = profileRouter;
