// Variables
global.modeDev = process.env.PRODUCTION && process.env.PRODUCTION != 'false';
global.port = getPort(26000);
global.host = global.modeDev ? '85.14.137.12' : '127.0.0.1';
global.ssl = true;
global.controllerClient = null;
global.supervisionClients = [];

// Local modules
var logger = require('./src/utils/logger.js');

var router = require('./src/message_routes.js');
var errorHandler = require('./src/utils/error_handler.js');

//var test = require('./src/utils/crash_test.js');

// Dependencies
var WebSocketServer = require('ws').Server;
var _ = require('lodash');
var fs = require('fs');

// We should load config from elsewhere...
var cfg = {
    ssl: global.ssl,
    port: global.port,
    host: global.host,
    ssl_key: './auth/server.key',
    ssl_cert: './auth/server.crt',
    ca: './auth/ca.crt'
};

var httpServ = ( cfg.ssl ) ? require('https') : require('http');
var app = null;

// --------------------------------------------------------------
// ------ HTTPS SERVER SETUP ------------------------------------
// --------------------------------------------------------------
// dummy request processing
var processRequest = function (req, res) {
    logger.log('info', 'Request on the https server !');
    res.writeHead(200);
    res.end("All glory to WebSockets!\n");
};

if (cfg.ssl) {

    app = httpServ.createServer({
        // providing server with  SSL key/cert
        key: fs.readFileSync(cfg.ssl_key),
        cert: fs.readFileSync(cfg.ssl_cert),
        ca: [fs.readFileSync(cfg.ca)],
        host: cfg.host,
        requestCert: true,
        rejectUnauthorized: true

    }, processRequest).listen(cfg.port, function () {
        logger.log('info', '*********************************************************************');
        logger.log('info', '******************* HTTPS SERVER BOUND ! ****************************');
        logger.log('info', '*********************************************************************');
        logger.log('info', 'URL : ' + cfg.host + ':' + cfg.port);
    });

    app.on('clientError', function (e, socket) {
        logger.log('error', 'clientError on https server : %o', e);
    });

} else {
    app = httpServ.createServer({
        host: cfg.host
    }, processRequest).listen(cfg.port);
}

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

// WEBSOCKET SERVER INIT
var wss = new WebSocketServer({server: app});


// --------------------------------------------------------------
// ------- MANAGING CONNECTIONS ---------------------------------
// --------------------------------------------------------------
// Connexion websocket
wss.on('connection', function connection(client) {
    logger.log('info', 'New client connected !');

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
            return;
        }

        // 2 - Message has a messageType key
        if (message.messageType) {

            if (message.error === undefined) {
                // 3 - DISPATCHING THE MESSAGE TO THE RIGHT HANDLER
                router.route(message, client);
            } else {
                // 3 BIS - THE MESSAGE IS IN FACT AN ERROR MESSAGE
                router.error(message, client);
            }
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
        logger.log('info', 'Client disconnected', message);

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

    client.on('error', function (err) {
        logger.log('error', 'An error occured with a websocket client : %o', err);
    })
});

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

// Error occured with the underlying server
wss.on('error', function (error) {
    logger.log('error', 'error on webSocket server ! : %o', error);
});

/**
 * Get the port for the server through the comand line argument.
 * if no mort provided, default port is returned.
 *
 * @param args : ommand line arguments parsed by minimist.
 * @param defaultPort
 * @returns {*}
 */
function getPort(defaultPort) {
    var _ = require('lodash');
    var argv = require('minimist')(process.argv.slice(2));
    if (typeof(argv['p']) != 'undefined' && !_.isNaN(parseInt(argv['p']))) {
        return argv['p'];
    } else if (typeof(argv['port']) != 'undefined' && !_.isNaN(parseInt(argv['port']))) {
        return argv['port'];
    }
    return defaultPort;
}