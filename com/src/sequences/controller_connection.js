/**
 * Created by yann on 24/07/2015.
 *
 * Handle what happend when the controller connects to the server
 */
var config = require('../commands/config.js');
var logger = require('../utils/logger.js');

module.exports = {
    /**
     * Instructions sequenc to be executed when
     * the controller is bound to the server.
     * @param client
     */
    onNewController: function (client) {
        // Displays controller's config in logs
        config.sendConfigurationQuery();

        //logger.log('info', 'Update config on controller ?');

        //// TODO : launch the sequence on the prod server to try ssl
        //// Update server's url in the controller (1 time action)
        //config.sendConfigurationUpdate({
        //    "serverURL" : "wss://85.14.137.12:26000/"
        //});
    }
};
