const { app } = require('./app/app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, (result) => {
	console.log('app listening on port: ' + PORT);
});
