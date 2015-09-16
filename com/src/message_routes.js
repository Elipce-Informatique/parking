// Local modules
var config_controller = require('./commands/config.js'), config_controller = new config_controller();
var events_controller = require('./commands/events.js'), events_controller = new events_controller();
var busenum_controller = require('./commands/bus_enumeration.js'), busenum_controller = new busenum_controller();
var logger = require('./utils/logger.js');
var errorHandler = require('./utils/error_handler.js');
var ctrlSequence = require('./sequences/controller_connection.js');
var initSequence0 = require('./sequences/init_parking_0.js');
var initSequence1 = require('./sequences/init_parking_1.js');
var initSequence2 = require('./sequences/init_parking_2.js');

/**
 * Dispatches the message received to the right handler
 *
 * @param message : object -> the json message parsed
 * @param client : object -> the client socket that sent the message
 */
module.exports.route = function (message, client) {

    // Dispatching the message to the right handler
    switch (message.messageType) {
        case 'init_parking':
            switch (data.mode) {
                case 0: // GET init mode  (controller DB is full, supervision read it)
                    initSequence0.start(client, config_controller);
                    break
                case 1: // SET mode with busEnum
                    initSequence1.start(client, config_controller);
                    break;
                case 2: // SET mode with busEnum + virtual sensors
                    initSequence2.start(client, config_controller);
                    break;
            }

            break;
        case 'job' : // Query the physical network
            if (message.error === undefined) {
                switch (message.data.job) {
                    case 'busEnum':
                        busenum_controller.onBusEnum(message.data);
                        break;
                    default:
                        logger.log('error', 'DATA.JOB ERROR -> job: ' + message.data.job + ' unknown in the router');
                        break;
                }
            }
            // Error bus enum
            else {
                logger.log('error', 'JOB START ERROR', message.error);
            }
            break;
        // Controller is connected
        case 'capabilities':
            // USHER IS TALKING TO US (LOL WE'RE FAMOUS !)
            config_controller.onCapabilities(message.data, client);
            ctrlSequence.onNewController(client, config_controller, events_controller);
            break;
        case 'configuration':
            // THE CONTROLLER SENDS ITS CONFIGURATION
            config_controller.onConfigurationData(message.data);
            break;
        case 'supervisionConnection':
            // A WEB BROWSER IS CONNECTED
            client.isController = false;
            global.supervisionClients.push(client);
            //logger.log('info', 'NB clients '+global.supervisionClients.length);
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
        case 'counterConfigQuery':
            // RELAY THE MESSAGE THAT COMES FROM SUPERVISION
            config_controller.sendCounterConfigQuery(client);
            break;
        case 'counterConfigData':
            // INSERT THE RECEIVED DATA IN DATABASE
            config_controller.onCounterConfigData(message.data);
            break;
        case 'viewConfigQuery':
            // RELAY THE MESSAGE THAT COMES FROM SUPERVISION
            config_controller.sendViewConfigQuery(client);
            break;
        case 'viewConfigData':
            // INSERT THE RECEIVED DATA IN DATABASE
            config_controller.onViewConfigData(message.data);
            break;
        case 'settingsQuery':
            // RELAY THE MESSAGE THAT COMES FROM SUPERVISION
            config_controller.sendSettingsQuery(client);
            break;
        case 'settingsData':
            // INSERT THE RECEIVED DATA IN DATABASE
            config_controller.onSettingsData(message.data);
            break;
        case 'remoteControl':
            config_controller.sendRemoteControl(message.data.command);
            break;

    /***** EVENT ******/
        case 'eventData':
            // INSERT THE RECEIVED DATA IN DATABASE
            events_controller.onEventData(message.data);
            break;


        // FALLBACK, LOG THE UNKNOWN MESSAGE
        default:
            logger.log('error', 'MESSAGE TYPE ERROR -> messageType: ' + message.messageType + ' unknown in the router');
            break;

    }
    // Trace
    logger.log('info', 'INCOMING QUERY: messageType: ' + message.messageType + ' - Client type: ' + (client.isController != undefined ? (client.isController ? 'Controller' : 'Supervision') : 'unknown'));

};
/**
 * Dispatches the errors sent by any client
 * @param message
 * @param client
 */
module.exports.error = function (message, client) {
    logger.log('error', 'ERROR MESSAGE RECEIVED FROM CLIENT : %o', message)
};
