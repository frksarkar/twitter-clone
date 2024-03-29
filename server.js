const { app } = require('./app/app');
const { dbConnection } = require('./config/databaseConnection');
const { initializeSocket } = require('./config/socket');

const PORT = process.env.PORT || 3000;
dbConnection(() => {
	const server = app.listen(PORT, (result) => {
		console.log('app listening on port: ' + PORT);
	});
	initializeSocket(server);

});

