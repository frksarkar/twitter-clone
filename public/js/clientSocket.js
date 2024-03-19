let connected = false;
const socket = io();

socket.emit('setup', user);
socket.on('connected', () => {
	connected = true;
});

socket.on('receive-message', (data) => messageReceive(data));
