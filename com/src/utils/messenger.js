/**
 * Created by yann on 29/07/2015.
 */
var logger = require('./logger.js');

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
    send: function (socket, messageType, data, error, errorSocket) {
        // The target socket is null
        if (socket == null || typeof socket === 'undefined') {
            // Error message to the error client
            this.send(errorSocket, messageType, {}, {
                "text": "The client socket supplied for this message is null or undefined."
            });
            logger.log('error', "The client socket supplied for this message is null or undefined.");
        }
        // The socket is not open
        else if (socket.readyState !== WebSocket.OPEN) {
            this.send(errorSocket, messageType, {}, {
                "text": "The client socket supplied for this message is not opened."
            });
            logger.log('error', "The client socket supplied for this message is not opened.");
        }
        // This is an error message
        else if (typeof error === 'object') {
            var message = {
                "messageType": messageType,
                "error": error
            };
            socket.send(JSON.stringify(message), errorHandler.onSendError);
        }
        // Let's go !
        else {
            var message = {
                "messageType": messageType,
                "data": data
            };
            socket.send(JSON.stringify(message), errorHandler.onSendError);
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
    supervisionBroadcast: function (messageType, data, error, errorSocket) {
        global.supervisionClients.forEach(function (socket) {
            this.send(socket, messageType, data, error, errorSocket);
        }, this);
    }
};