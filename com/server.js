// Variables
var modeDev = process.env.PRODUCTION && process.env.PRODUCTION != 'false';
var port = 26000;
var host = modeDev ? '85.14.137.12' : '127.0.0.1';
var controllerClient = null;
var supervisionClients = [];

// Dependencies
var helper = require('./src/server_helper.js');
var logger = require('./src/logger.js');
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

        // 1 - Parsing the JSON
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

        // 2 - Message has a messageType key
        if (message.messageType) {
            // Trace
            logger.log('info', 'Query: messageType: ' + message.messageType);

            // 3 - Dispatching the message to the right handler
            switch (message.messageType) {
                // Controller is connected
                case 'capabilities':
                    // Olav is speaking to us
                    controllerClient = client;
                    // Send capabilities
                    helper.capabilities(port, client);
                    break;
                // A web browser is connected
                case 'supervisionConnection':
                    supervisionClients.push(client);
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
        // 2bis - Message doesn't have a messageType key
        else {
            // Trace
            logger.log('info', 'Query without messageType: ' + msg);
            var retour = {
                messageType: 'error',
                error: {
                    action: "messageType key is missing in the request",
                    text: "There is the message you sent: " + msg
                }
            }
            client.send(JSON.stringify(retour));
        }
    });


    /**
     * Sur fermeture du socket, suppression du client de la liste de supervision
     * ou du controller
     */

    client.on('close', function (code, message) {
        // Controller closed
        if (_.isEqual(client, controllerClient)) {
            controllerClient = null;
        }
        // At least 1 webclient
        else if (supervisionClients.length > 0) {
            // Parse clients
            supervisionClients = _.map(supervisionClients, function (cli) {
                // Not this client closed
                if (!_.isEqual(client, cli)) {
                    return cli;
                }
            }.bind(this));
        }
    });
});


// ON LANCE UN CLIENT DE TEST EN MODE DEV
if (!process.env.PRODUCTION || process.env.PRODUCTION == "false") {

    logger.log('info', 'MODE DEV');
    // Dependencies
    var helperClient = require('./src/test_helper.js');

    // Client
    var WebSocket = require('ws');
    var ws = new WebSocket('ws://' + host + ':' + port);

    ws.on('open', function open() {
        var cap = JSON.stringify(helperClient.busConfigData());
        //logger.log('info', 'client envoie capabilities '+cap);
        ws.send(cap);
    });

    ws.on('message', function (data, flags) {
        logger.log('info', 'client reçoit: %s', data);
    });
}

