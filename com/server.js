// Server HTTP
var WebSocketServer = require('ws').Server;
var http = require('http')
    , express = require('express')
    , app = express();

var port = 26000;
//var host = '127.0.0.1';
var host = '85.14.137.12';

// Server Websocket
var wss = new WebSocketServer({
    host: host,
    port: port
});

wss.on('connection', function connection(client) {
    client.on('message', function incoming(message) {
        console.log('reçu: %s', message);
        client.send('Hello Olaf, there is your message: "'+ message+'"');
    });
});

