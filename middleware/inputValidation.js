const { check } = require('express-validator');

exports.fieldValidation = [
	check('userName').trim().notEmpty(),
	check('email').isEmail().isLowercase(),
	check('password').isLength({ min: 6 }),
];
