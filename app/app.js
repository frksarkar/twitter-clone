const express = require('express');
const path = require('path');

const { loginRouter } = require('../routers/loginRouter');
const { redirectToLogin } = require('../controller/loginController');

const app = express();

// set default values
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '..', 'public')));

// routers
app.use('/login', loginRouter);
app.use('/', redirectToLogin)

exports.app = app;
