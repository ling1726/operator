const ws = require('ws');

const socket = new ws.WebSocket('ws://localhost:8080');

socket.on('open', () => {
    socket.send('Hello');
})