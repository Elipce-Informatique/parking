// Variables
global.modeDev = process.env.PRODUCTION && process.env.PRODUCTION != 'false';
global.port = 26000; // TODO : configurer ça en paramètre de commande
global.host = global.modeDev ? '85.14.137.12' : '127.0.0.1';
global.controllerClient = null;
global.supervisionClients = [];

// Dependencies
var WebSocketServer = require('ws').Server;
var _ = require('lodash');

// HTTP Server requirement
var http = require('http')
    , express = require('express')
    , app = express();

// Local modules
var logger = require('./src/utils/logger.js');
var router = require('./src/message_routes.js');
var errorHandler = require('./src/utils/error_handler.js');

// Websocket Server init
var wss = new WebSocketServer({
    host: global.host,
    port: global.port
});


// Connexion websocket
wss.on('connection', function connection(client) {

    client.on('message', function incoming(msg) {
        var message = {};
        // 1 - Parsing the JSON
        try {
            // JSON decode
            message = JSON.parse(msg);
        }
            // No JSON format
        catch (e) {
            logger.log('error', 'Message is not a valid JSON : %o', e);
            client.send(JSON.stringify({
                messageType: 'error',
                error: {
                    action: "Message is not a valid JSON",
                    text: ""
                }
            }), errorHandler.onSendError);
            return;
        }

        // 2 - Message has a messageType key
        if (message.messageType) {
            // 3 - DISPATCHING THE MESSAGE TO THE RIGHT HANDLER
            router.route(message, client);
        }
        // 2 BIS - Message doesn't have a messageType key
        else {
            // Trace
            logger.log('info', 'Query without messageType: ' + msg);
            var retour = {
                messageType: 'error',
                error: {
                    action: "messageType key is missing in the request",
                    text: "There is the message you sent: " + msg
                }
            };
            client.send(JSON.stringify(retour), errorHandler.onSendError);
        }
    });


    /**
     * Sur fermeture du socket, suppression du client de la liste de supervision
     * ou du controller
     */

    client.on('close', function (code, message) {
        // Controller closed
        if (_.isEqual(client, controllerClient)) {
            global.controllerClient = null;
        }
        // At least 1 webclient
        else if (supervisionClients.length > 0) {
            // iterate over clients
            global.supervisionClients = _.map(global.supervisionClients, function (cli) {
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
    var helperClient = require('./src/utils/test_helper.js');

    // Client
    var WebSocket = require('ws');
    var ws = new WebSocket('ws://' + host + ':' + port);

    ws.on('open', function open() {
        var cap = JSON.stringify(helperClient.busConfigData());
        //logger.log('info', 'client envoie capabilities '+cap);
        ws.send(cap, errorHandler.onSendError);
    });

    ws.on('message', function (data, flags) {
        logger.log('info', 'client reçoit: %s', data);
    });
}

