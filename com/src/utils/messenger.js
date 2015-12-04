/**
 * Created by yann on 29/07/2015.
 */
var WebSocket = require('ws');
var _ = require('lodash');

var logger = require('./logger.js');
var errorHandler = require('./error_handler.js');

module.exports = {
    /**
     * Handle the sending of a message through a websocket.
     *
     * @param socket -> the websocket to send the message through
     * @param messageType : string -> The type of the message
     * @param data : any -> any type of data to send
     * @param error : optional object -> the error object to send to the socket. (Possible keys are "action", "text", "code")
     * If an error is provided, the data argument is ignored.
     * @param errorSocket : optional -> the socket to send potential errors to.
     */
    send: function (socket, messageType, data, error, errorSocket, callback) {
        // The target socket is null
        if (socket == null || typeof socket === 'undefined') {
            if (errorSocket != undefined && errorSocket.readyState !== WebSocket.OPEN) {
                // Error message to the error client
                this.send(errorSocket, messageType, {}, {
                    "text": "The client socket supplied for this message is null or undefined."
                }, {}, callback);
            }
            logger.log('error', "The client socket supplied for this message is null or undefined.");
        }
        // The socket is not open
        else if (socket.readyState !== WebSocket.OPEN) {
            if (errorSocket != undefined && errorSocket.readyState !== WebSocket.OPEN) {
                this.send(errorSocket, messageType, {}, {
                    "text": "The client socket supplied for this message is not opened."
                }, {}, callback);
            }
            logger.log('error', "The client socket supplied for this message is not opened.");
        }
        // This is an error message
        else if (_.isObject(error) && !_.isEmpty(error)) {
            var message = {
                "messageType": messageType,
                "error": error
            };
            socket.send(JSON.stringify(message), callback == undefined ? errorHandler.onSendError : callback);
        }
        // We have all we need, Let's go !
        else if (!_.isEmpty(data)) {
            var message = {
                "messageType": messageType,
                "data": data
            };
            socket.send(JSON.stringify(message), callback == undefined ? errorHandler.onSendError : callback);
        }
        // We don't have any data to send, just the messageType
        else if (_.isEmpty(data)) {
            var message = {
                "messageType": messageType
            };
            socket.send(JSON.stringify(message), callback == undefined ? errorHandler.onSendError : callback);
        }
    },

    /**
     * Sends a message to the controller if possible.
     *
     * @see send method above for the params.
     *
     * @param messageType
     * @param data
     * @param error
     * @param errorSocket
     */
    sendToController: function (messageType, data, error, errorSocket) {
        // There is no controller yet
        if (global.controllerClient !== null) {
            // Error message to the original client
            this.send(global.controllerClient, messageType, data, error, errorSocket);
            var now = new Date();
            logger.log('info', 'OUTGOING QUERY TO CONTROLLER at ' + now.toISOString() + ': messageType: ' + messageType);
        } else {
            // No controller connected yet
            this.send(errorSocket, messageType, {}, {
                "text": "sendToController : No controller connected to send this message : " + messageType
            });
            logger.log('error', 'sendToController : No controller connected to send this message' + messageType);
        }
    },

    /**
     * Sends a message to all the supervision clients
     *
     * @see send method above for the params.
     *
     * @param messageType
     * @param data
     * @param error
     * @param errorSocket
     */
    supervisionBroadcast: function (messageType, data, error, errorSocket, callback) {
        //logger.log('info', 'BROADCAST NB ' + global.supervisionClients.length);
        global.supervisionClients.forEach(function (socket, index) {
            this.send(socket, messageType, data, error, errorSocket, callback);
        }, this);
    }
};