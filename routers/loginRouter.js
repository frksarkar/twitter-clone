const express = require('express');
const login = require('../controller/loginController');
const { loginAuth } = require('../middleware/authHandler');

const loginRouter = express.Router();

loginRouter.get('/', loginAuth, login.viewLoginForm);

loginRouter.post('/', login.postLogin);

exports.loginRouter = loginRouter;
