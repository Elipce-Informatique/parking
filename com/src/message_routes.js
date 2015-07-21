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
            // Olav is speaking to us
            global.controllerClient = client;
            // Send capabilities
            config_controller.capabilities(port, client);
            break;
        // A web browser is connected
        case 'supervisionConnection':
            global.supervisionClients.push(client);
            break;
        case 'busConfigQuery':
            // Relay message
            global.controllerClient.send(JSON.stringify(message));
            break;
        case 'busConfigData':
            // Insert the received data in database
            config_controller.busConfigData(port, message.data);
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
};