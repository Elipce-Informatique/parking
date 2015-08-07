/**
 * Created by yann on 24/07/2015.
 *
 * Handle what happend when the controller connects to the server
 */
var logger = require('../utils/logger.js');
var init = require('./init_parking.js');

var evtsSequence = require('./events_lifecycle.js');

module.exports = {
    /**
     * Instructions sequenc to be executed when
     * the controller is bound to the server.
     * @param client
     */
    onNewController: function (client, ConfigHandler, EventHandler) {

        // Instance of Event Sequence with the event contoller
        evtsSequence = new evtsSequence(EventHandler);

        // On new controller connection, we send our capabilities
        ConfigHandler.sendCapabilities(client);

        // Launches the event lifecycle
        evtsSequence.startEventLoop();

        // TODO - Check in the database if the parking has been initialized and launch the init sequence !
        //init.start(ConfigHandler);
    }
};
