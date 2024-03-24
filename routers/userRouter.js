const express = require('express');
const user = require('../controller/userController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRouter = express.Router();

userRouter.get('/', user.filteredUsers);

userRouter.get('/:userId',  user.getFollowerAndFollowing);

userRouter.put('/:userId/follow', user.getFollow);

userRouter.put(
	'/update/profile/:userId/image',
	upload.single('profilePicture'),
	user.profilePicUpdate,
	user.updatePicture
);

userRouter.put(
	'/update/cover/:userId/image',
	upload.single('coverPicture'),
	user.coverPicUpdate,
	user.updatePicture
);

exports.userRouter = userRouter;
