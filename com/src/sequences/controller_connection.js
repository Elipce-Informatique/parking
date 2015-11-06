/**
 * Created by yann on 24/07/2015.
 *
 * Handle what happend when the controller connects to the server
 */
var logger = require('../utils/logger.js');
var init = require('./init_parking_0.js');

var evtsSequence = require('./events_lifecycle.js');

module.exports = {
    /**
     * Instructions sequenc to be executed when
     * the controller is bound to the server.
     * @param client
     */
    onNewController: function (client, ConfigHandler, EventHandler) {

        // Instance of Event Sequence with the event contoller
        var eventsHandler = new evtsSequence(EventHandler);
        // On new controller connection, we send our capabilities
        ConfigHandler.sendCapabilities(client);

        // Get the parking identifier
        ConfigHandler.setParkingId();

        if (global.activateEventLoop) {
            logger.log('info', 'Starting EVENT LOOP');
            // Launches the event lifecycle
            eventsHandler.startEventLoop();
        }
    }
};
