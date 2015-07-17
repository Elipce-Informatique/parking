// Variables
var port = 26000;
var host = process.env.PRODUCTION ? '85.14.137.12' : '127.0.0.1';
var controllerClient = null;
var webBrowserClients = [];

// Dependencies
var helper = require('./helper.js').Server;
var logger = require('./helper.js').Log;
var _ = require('lodash');

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


// Connexion websocket
wss.on('connection', function connection(client) {
    client.on('message', function incoming(msg) {

        try {
            // JSON decode
            message = JSON.parse(msg);
        }
            // No JSON format
        catch (e) {
            logger.log('error', 'Message is not a valid JSON');
            client.send(JSON.stringify({
                messageType: 'error',
                error: {
                    action: "Message is not a valid JSON",
                    text: ""
                }
            }));
            return;
        }

        // Message has a messageType key
        if (message.messageType) {
            // Trace
            logger.log('info', 'Query: messageType: ' + message.messageType);

            switch (message.messageType) {
                // Controller is connected
                case 'capabilities':
                    // Olav is speaking to us
                    controllerClient = client;
                    // Send capabilities
                    helper.capabilities(port, client);
                    break;
                // A webbrowser is connected
                case 'hello':
                    webBrowserClients.push(client);
                    break;
                case 'busConfigQuery':
                    // Relay message
                    controllerClient.send(msg);
                    break;
                case 'busConfigData':
                    helper.busConfigData(port, message.data);
                    break;
                default:
                    var retour = {
                        messageType: message.messageType,
                        error: {
                            action: "messageType error",
                            text: "I don't know this messageType: " + message.messageType
                        }
                    }
                    client.send(JSON.stringify(retour));
                    break;

            }
        }
        // Message doesn't have a messageType key
        else {
            // Trace
            logger.log('info', 'Query without messageType: ' + msg);
            var retour = {
                messageType: 'error',
                error: {
                    action: "messageType key missing",
                    text: ""
                }
            }
            client.send(JSON.stringify(retour));
        }
    });

    client.on('close', function (code, message) {
        // Controller closed
        if (_.isEqual(client, controllerClient)) {
            controllerClient = null;
        }
        // At least 1 webclient
        else if (webBrowserClients.length > 0) {
            // Parse clients
            webBrowserClients = _.map(webBrowserClients, function (cli) {
                // Not this client closed
                if (!_.isEqual(client, cli)) {
                    return cli;
                }
            }.bind(this));
        }
    });
});


if (!process.env.PRODUCTION) {

    console.log('MODE DEV');
    // Dependencies
    var helperClient = require('./helper.js').Client;

    // Client
    var WebSocket = require('ws');
    var ws = new WebSocket('ws://' + host + ':' + port);

    ws.on('open', function open() {
        var cap = JSON.stringify(helperClient.busConfigData());
        //console.log('client envoie capabilities '+cap);
        ws.send(cap);
    });

    ws.on('message', function (data, flags) {
        console.log('client reçoit: %s', data);
    });
}

