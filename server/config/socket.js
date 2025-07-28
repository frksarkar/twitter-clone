const { Server } = require('socket.io');

exports.initializeSocket = (server) => {
	const io = new Server(server);

	io.on('connection', (client) => {
		client.on('setup', (data) => {
			client.join(data._id);
			client.emit('connected');
		});

		client.on('join-chats', (chatId) => client.join(chatId));

		client.on('typing', (chatId) => client.to(chatId).emit('typing'));

		client.on('message', (data) => {
			client.to(data.chat._id).emit('receive-message', data);
		});
	});
};
