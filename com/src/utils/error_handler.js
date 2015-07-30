// Local modules
var logger = require('./logger.js');

module.exports = {
    /**
     * Callback to use in the "send" calls if you're not
     * handling the error by yourself
     * @param error
     */
    onSendError: function (error) {
        // Logs the error into the console and a file.
        logger.log('error', 'Websocket send error : %o', error);
    }
};