const express = require('express');
const login = require('../controller/loginController');

const loginRouter = express.Router();

loginRouter.get('/', login.viewLoginForm);

exports.loginRouter = loginRouter;
