const swaggerRouter = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			'x-logo': {
				url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png',
			},
			title: 'twitter clone API',
			version: '1.0.0',
			description: 'twitter clone API documentation using swagger and express jsdoc library',
			contact: {
				name: 'Twitter Clone API',
			},
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Development Server',
			},
		],
	},
	apis: [
		path.join(__dirname, '..', 'routers', '*.js'), // Path to the API docs
		path.join(__dirname, '..', 'controller', '*.js'), // Path to the controller docs
		path.join(__dirname, '..', 'middleware', '*.js'), // Path to the middleware docs
	],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = swaggerRouter;
