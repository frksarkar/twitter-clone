const express = require('express');
const user = require('../controller/userController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRouter = express.Router();

userRouter.get('/:userId', user.getFollowerAndFollowing);

userRouter.put('/:userId/follow', user.getFollow);

userRouter.put(
	'/update/:userId/image',
	upload.single('profileImage'),
	user.profilePicUpdate
);

exports.userRouter = userRouter;
