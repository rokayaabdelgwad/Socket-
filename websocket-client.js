const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001/socket_server');

ws.on('open', function open() {
  console.log('Connected to WebSocket server');
  
  // Send a message to the WebSocket server
  ws.send('Hello WebSocket server!');
});

ws.on('message', function incoming(data) {
  console.log('Received message from server:', data);
});

ws.on('close', function close() {
  console.log('Disconnected from WebSocket server');
});
