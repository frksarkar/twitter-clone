const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const { loginRouter } = require('../routers/loginRouter');
const { registerRouter } = require('../routers/registerRouter');
const { errorHandler } = require('../middleware/errorHandler');
const { postRouter } = require('../routers/postRouter');
const { isLogin } = require('../middleware/authHandler');
const { homeRouter } = require('../routers/homeRouter');
const morgan = require('morgan');

const app = express();

// set default values
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

// routers
app.use('/api/posts', postRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/', isLogin, homeRouter);

//todo: not found router

// error handlers
app.use(errorHandler);

exports.app = app;
