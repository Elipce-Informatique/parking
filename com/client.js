//var host = '127.0.0.1';
var host = '85.14.137.12';
var port = 26000;

// Client
var WebSocket = require('ws');
var ws = new WebSocket('ws://' + host + ':' + port);

ws.on('open', function open() {
    ws.send('allô Raymond !!');
});

ws.on('message', function (data, flags) {
    console.log('reçu: %s', data);
});