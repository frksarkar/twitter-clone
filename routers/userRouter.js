const express = require('express');
const user = require('../controller/userController');

const userRouter = express.Router();

userRouter.get('/:userId', user.getFollowerAndFollowing);

userRouter.put('/:userId/follow', user.getFollow);

exports.userRouter = userRouter;
