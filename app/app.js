const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');

const { loginRouter } = require('../routers/loginRouter');
const { registerRouter } = require('../routers/registerRouter');
const { errorHandler } = require('../middleware/errorHandler');
const { postsRouter } = require('../routers/postsRouter');
const { isLogin } = require('../middleware/authHandler');
const { homeRouter } = require('../routers/homeRouter');
const { profileRouter } = require('../routers/profileRouter');
const { logoutRouter } = require('../routers/logoutRouter');
const { userRouter } = require('../routers/userRouter');
const { searchRouter } = require('../routers/searchRouter');
const { inboxRouter } = require('../routers/inboxRouter');
const { chatRouter } = require('../routers/chatRouter');
const { notFound } = require('../middleware/notFoundHandler');
const { messageRouter } = require('../routers/messageRouter');
const { notificationRouter } = require('../routers/notificationRouter');
const { postRouter } = require('../routers/postRouter');

const app = express();

//	set default values
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
	session({
		secret: 'secret key',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 3600000 },
	})
);

//	routers
app.use('/api/posts', isLogin, postsRouter);
app.use('/api/message', isLogin, messageRouter);
app.use('/api/chat', isLogin, chatRouter);
app.use('/login', loginRouter);
app.use('/logout', isLogin, logoutRouter);
app.use('/register', registerRouter);
app.use('/', isLogin, homeRouter);
app.use('/profile', isLogin, profileRouter);
app.use('/users', isLogin, userRouter);
app.use('/search', isLogin, searchRouter);
app.use('/messages', isLogin, inboxRouter);
app.use('/notifications', isLogin, notificationRouter);
app.use('/post', isLogin, postRouter);

//	not found handlers
app.use('/:id', notFound);

//	error handlers
app.use(errorHandler);

exports.app = app;
