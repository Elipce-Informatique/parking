/**
 * Created by yann on 24/07/2015.
 *
 * Handle what happend when the controller connects to the server
 */
var config = require('../commands/config.js');
var logger = require('../utils/logger.js');
var init = require('./init_parking.js');

module.exports = {
    /**
     * Instructions sequenc to be executed when
     * the controller is bound to the server.
     * @param client
     */
    onNewController: function (client) {
        // TEMP - Displays controller's config in logs
        config.sendConfigurationQuery();

        // TODO - Check in the database if the parking has been initialized and launch the init sequence !
        init.start();
    }
};
