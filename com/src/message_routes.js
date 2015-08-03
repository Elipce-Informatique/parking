// Local modules
var config_controller = require('./commands/config.js'), config_controller = new config_controller();
var events_controller = require('./commands/events.js'), events_controller = new events_controller();
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
            // USHER IS SPEAKING TO US (LOL WE'RE FAMOUS !)
            config_controller.onCapabilities(message.data, client);
            ctrlSequence.onNewController(client);
            break;
        case 'configuration':
            // THE CONTROLLER SENDS ITS CONFIGURATION
            config_controller.onConfigurationData(message.data);
            break;
        case 'supervisionConnection':
            // A WEB BROWSER IS CONNECTED
            client.isController = false;
            global.supervisionClients.push(client);
            break;
        case 'busConfigQuery':
            // RELAY THE MESSAGE THAT COMES FROM SUPERVISION
            config_controller.sendBusConfigQuery(client);
            break;
        case 'busConfigData':
            // INSERT THE RECEIVED DATA IN DATABASE
            config_controller.onBusConfigData(message.data);
            break;
        case 'sensorConfigQuery':
            // RELAY THE MESSAGE THAT COMES FROM SUPERVISION
            config_controller.sendSensorConfigQuery(message.data.busId, client);
            break;
        case 'sensorConfigData':
            // INSERT THE RECEIVED DATA IN DATABASE
            config_controller.onSensorConfigData(message.data);
            break;
        case 'displayConfigQuery':
            // RELAY THE MESSAGE THAT COMES FROM SUPERVISION
            config_controller.sendDisplayConfigQuery(message.data.busId, client);
            break;
        case 'displayConfigData':
            // INSERT THE RECEIVED DATA IN DATABASE
            config_controller.onDisplayConfigData(message.data);
            break;
        // TODO IN THE DATABASE -------------------------------------------
        case 'counterConfigQuery':
            // RELAY THE MESSAGE THAT COMES FROM SUPERVISION
            config_controller.sendCounterConfigQuery(client);
            break;
        case 'counterConfigData':
            // INSERT THE RECEIVED DATA IN DATABASE
            config_controller.onSensorConfigData(message.data);
            break;
        case 'viewConfigQuery':
            // RELAY THE MESSAGE THAT COMES FROM SUPERVISION
            config_controller.sendViewConfigQuery(client);
            break;
        case 'viewConfigData':
            // INSERT THE RECEIVED DATA IN DATABASE
            config_controller.onViewConfigData(message.data);
            break;
        // END TODO IN THE DATABASE ---------------------------------------
        case 'eventQuery':
            // RELAY THE MESSAGE THAT COMES FROM SUPERVISION
            events_controller.sendEventQuery(message.data.ackId);
            break;
        case 'eventData':
            // INSERT THE RECEIVED DATA IN DATABASE
            events_controller.onEventData(message.data);
            break;
        // FALLBACK, LOG THE UNKNOWN MESSAGE
        default:
            logger.log('info', 'MESSAGE TYPE ERROR -> messageType: ' + message.messageType);
            //var retour = {
            //    messageType: message.messageType,
            //    error: {
            //        action: "messageType error",
            //        text: "Unexpected messageType: " + message.messageType
            //    }
            //};
            //client.send(JSON.stringify(retour), errorHandler.onSendError);
            break;

    }
};
/**
 * Dispatches the errors sent by any client
 * @param message
 * @param client
 */
module.exports.error = function (message, client) {
    logger.log('error', 'ERROR MESSAGE RECEIVED FROM CLIENT : %o', message)
};
