const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const { loginRouter } = require('../routers/loginRouter');
const { redirectToLogin } = require('../controller/loginController');
const { registerRouter } = require('../routers/registerRouter');
const { errorHandler } = require('../middleware/errorHandler');
const { postRouter } = require('../routers/postRouter');
const session = require('express-session');

const app = express();

// set default values
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
app.use('/api/post', postRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/', redirectToLogin);

//todo: not found router

// error handlers
app.use(errorHandler);

exports.app = app;
