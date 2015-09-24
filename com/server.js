// CONFIG
var conf = require('./config/config.js');
// Variables
global.modeDev = process.env.PRODUCTION && process.env.PRODUCTION != 'false';
global.port = getPort(global.modeDev ? conf.prod.port : conf.dev.port);
global.host = global.modeDev ? conf.prod.host : conf.dev.host;
global.ssl = true;
global.controllerClient = null;
global.supervisionClients = [];
global.parkingId = null;
global.legLength = conf.legLength;


// Local modules
var logger = require('./src/utils/logger.js');

var router = require('./src/message_routes.js');
var errorHandler = require('./src/utils/error_handler.js');

//var test = require('./src/utils/crash_test.js');

// Dependencies
var WebSocketServer = require('ws').Server;
var _ = require('lodash');
var fs = require('fs');

// Event Emitter
var EventEmitter = require("events").EventEmitter;
global.events = new EventEmitter();


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

    // delay a response to simulate a long running process,
    // while another request comes in with altered language settings
    res.end('All glory to WebSockets!');
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
        logger.log('error', 'clientError on https server', e);
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
        logger.log('info', 'Client disconnected');

        // Controller closed
        if (_.isEqual(client, controllerClient)) {
            logger.log('info', 'Client disconnected -> it was a controller');
            global.controllerClient = null;
            client.send(JSON.stringify( {
                messageType: 'controllerStatus',
                data: {
                    controller: false
                }}), errorHandler.onSendError);
        }
        // At least 1 webclient
        else if (supervisionClients.length > 0) {
            logger.log('info', 'Client disconnected -> it was a supervision. nb supervisions -> ' + supervisionClients.length);
            // iterate over clients
            global.supervisionClients = _.filter(global.supervisionClients, function (cli) {
                // Not this client closed
                return !_.isEqual(client, cli);
            }.bind(this));
            logger.log('info', 'Supervision client deleted. nb supervisions -> ' + supervisionClients.length);
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
 * @param args : Command line arguments parsed by minimist.
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