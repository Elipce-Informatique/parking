// Mode dev
var modeDev = false;
var host = modeDev ?'127.0.0.1' : '85.14.137.12';
var port = 26000;

// Dependencies
var helperClient = require('./helper.js').Client;

// Client
var WebSocket = require('ws');
var ws = new WebSocket('ws://' + host + ':' + port);

ws.on('open', function open() {
    ws.send(JSON.stringify(helperClient.capabilities()));
});

ws.on('message', function (data, flags) {
    console.log('reçu: %s', data);
});