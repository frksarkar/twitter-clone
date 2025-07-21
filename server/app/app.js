const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
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
} = require('../routers');

const { errorHandler, notFound, authMiddleware } = require('../middleware');

const app = express();

//	set default values
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'secret key',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day,
	})
);

// Swagger documentation route
app.use('/api-docs', swaggerRouter);

// Routers with authentication middleware
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
