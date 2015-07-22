// Local modules
var config_controller = require('./config_controller.js');
/**
 * Dispatches the message received to the right handler
 *
 * @param message : object -> the json message parsed
 * @param client : object -> the client socket that sent the message
 */
module.exports.route = function (message, client) {
    // Dispatching the message to the right handler
    switch (message.messageType) {
        // Controller is connected
        case 'capabilities':
            // Usher is speaking to us (Lol we're famous !)
            global.controllerClient = client;
            // Send capabilities
            config_controller.sendCapabilities(port, client);
            break;
        // A web browser is connected
        case 'supervisionConnection':
            global.supervisionClients.push(client);
            break;
        case 'busConfigQuery':
            // Relay the message that comes from supervision
            config_controller.sendBusConfigQuery();
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
            client.send(JSON.stringify(retour));
            break;

    }
};