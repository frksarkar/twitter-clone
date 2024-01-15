const { app } = require('./app/app');
const { dbConnection } = require('./config/databaseConnection');

const PORT = process.env.PORT || 3000;
dbConnection(() => {
	app.listen(PORT, (result) => {
		console.log('app listening on port: ' + PORT);
	});
});
