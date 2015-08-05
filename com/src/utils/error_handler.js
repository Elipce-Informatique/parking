// Local modules
var logger = require('./logger.js');

module.exports = {
    /**
     * Callback to use in the "send" calls if you're not
     * handling the error by yourself
     * @param err
     */
    onSendError: function (err) {
        // Logs the error into the console and a file.
        if (err) {
            logger.log('error', 'Websocket send error : ', err);
        } else {
            logger.log('info', 'SEND OK !');
        }
    },
    onMysqlEnd: function (err) {
        // The connection is terminated now
        if (err) {
            logger.log('error', 'Mysql end error : ', err);
        } else {
            logger.log('info', 'Mysql connection ended successfully');
        }
    }
};