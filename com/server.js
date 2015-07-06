
// Variables
var modeDev = false;
var port = 26000;
var host = modeDev ? '127.0.0.1' : '85.14.137.12';


// Dependencies
var helper = require('./helper.js').Server;

// Server HTTP
var WebSocketServer = require('ws').Server;
var http = require('http')
    , express = require('express')
    , app = express();

// Server Websocket
var wss = new WebSocketServer({
    host: host,
    port: port
});

// LOG
var path = require('path');
var winston = require('winston');

var filename = path.join(__dirname, '/log/event');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.DailyRotateFile)({ filename: filename })
    ]
});


// Connexion websocket
wss.on('connection', function connection(client) {
    client.on('message', function incoming(msg) {

        // JSON decode
        message = JSON.parse(msg);
        // Message has a messageType key
        if(message.messageType) {

            switch (message.messageType) {
                case 'capabilities':
                    helper.capabilities(port, client);
                    logger.log('info', 'capabilities');
                    break;
                default:
                    var retour = {
                        messageType: 'error',
                        data: "I don't know this messageType: " + message.messageType
                    }
                    client.send(JSON.stringify(retour));
                    break;

            }
        }
        // Message doesn't have a messageType key
        else{
            var retour = {
                messageType: 'error',
                data: "No messageType key"
            }
            client.send(JSON.stringify(retour));
        }
    });
});


if(modeDev){

    // Dependencies
    var helperClient = require('./helper.js').Client;

    // Client
    var WebSocket = require('ws');
    var ws = new WebSocket('ws://' + host + ':' + port);

    ws.on('open', function open() {
        var cap = JSON.stringify(helperClient.capabilities());
        //console.log('client envoie capabilities '+cap);
        ws.send(cap);
    });

    ws.on('message', function (data, flags) {
        //console.log('client reçoit: %s', data);
    });
}

