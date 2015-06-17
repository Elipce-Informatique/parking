// Serveur
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({port: 8080});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('reçu: %s', message);
    });

    //ws.send('something');
});


// Client
var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
    ws.send('allô Raymond !!');
});

ws.on('message', function (data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
});