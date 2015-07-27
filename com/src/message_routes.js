// Local modules
var config_controller = require('./commands/config.js');
var logger = require('./utils/logger.js');
var errorHandler = require('./utils/error_handler.js');
var ctrlSequence = require('./sequences/controller_connection.js');

/**
 * Dispatches the message received to the right handler
 *
 * @param message : object -> the json message parsed
 * @param client : object -> the client socket that sent the message
 */
module.exports.route = function (message, client) {
    // Trace
    logger.log('info', 'INCOMING QUERY: messageType: ' + message.messageType);
    logger.log('info', 'INCOMING QUERY: Client type: ' + (client.isController != undefined ? (client.isController ? 'Controller' : 'Supervision') : 'unknown'));

    // Dispatching the message to the right handler
    switch (message.messageType) {
        // Controller is connected
        case 'capabilities':
            // Usher is speaking to us (Lol we're famous !)
            config_controller.onCapabilities(message.data, client);
            ctrlSequence.onNewController(client);
            break;
        case 'supervisionConnection':
            // A web browser is connected
            client.isController = false;
            global.supervisionClients.push(client);
            break;
        case 'busConfigQuery':
            // Relay the message that comes from supervision
            config_controller.sendBusConfigQuery(client);
            break;
        case 'busConfigData':
            // Insert the received data in database
            config_controller.onBusConfigData(global.port, message.data);
            break;
        default:
            var retour = {
                messageType: message.messageType,
                error: {
                    action: "messageType error",
                    text: "Unexpected messageType: " + message.messageType
                }
            };
            client.send(JSON.stringify(retour), errorHandler.onSendError);
            break;

    }
};
/**
 * Dispatches the errors sent by any client
 * @param message
 * @param client
 */
module.exports.error = function (message, client) {
    logger.log('error', 'ERROR MESSAGE RECEIVED : %o', message)
};
