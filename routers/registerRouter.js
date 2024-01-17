const express = require('express');

const register = require('../controller/registerController');
const { fieldValidation } = require('../middleware/inputValidation');

const registerRouter = express.Router();

registerRouter.get('/', fieldValidation, register.viewRegisterForm);

exports.registerRouter = registerRouter;
