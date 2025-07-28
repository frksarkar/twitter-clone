const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const {
	loginRouter,
	registerRouter,
	postsRouter,
	homeRouter,
	profileRouter,
	logoutRouter,
	userRouter,
	searchRouter,
	inboxRouter,
	chatRouter,
	messageRouter,
	notificationRouter,
	postRouter,
	swaggerRouter,
	bookmarkRouter,
	repliesRouter,
	authRouter,
} = require('../routers');

const { errorHandler, notFound, authMiddleware } = require('../middleware');

const app = express();

//	set default values
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Swagger documentation route
app.use('/api-docs', swaggerRouter);

// Routers with authentication middleware
app.use('/api', authRouter);
app.use('/api/posts', authMiddleware, postsRouter);
app.use('/api/messages', authMiddleware, messageRouter);
app.use('/api/chats', authMiddleware, chatRouter);
app.use('/api/bookmarks', authMiddleware, bookmarkRouter);
app.use('/api/replies', authMiddleware, repliesRouter);

// Public routes
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// Authenticated routes
app.use('/logout', authMiddleware, logoutRouter);
app.use('/', authMiddleware, homeRouter);
app.use('/profile', authMiddleware, profileRouter);
app.use('/users', authMiddleware, userRouter);
app.use('/search', authMiddleware, searchRouter);
app.use('/inbox', authMiddleware, inboxRouter);
app.use('/notifications', authMiddleware, notificationRouter);
app.use('/posts', authMiddleware, postRouter);

//	not found handlers
app.use('/:id', notFound);

//	error handlers
app.use(errorHandler);

exports.app = app;
