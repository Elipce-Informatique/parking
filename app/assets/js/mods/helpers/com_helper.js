var W3CWebSocket = require('websocket').w3cwebsocket;
var conf = require('../../config/config.js');
/**
 * Gère la communication client webbrowser vers server
 *
 */
module.exports.client = {
    host: null,
    port: null,
    client: {},

    /**
     * Opens a secured websocket on the communication server.
     */
    initWebSocket: function (parkingId, onConnexion, onError) {

        // Read and store confg
        this.host = conf[parkingId].host;
        this.port = conf[parkingId].port;

        if (clientWs === null && !(clientWs instanceof W3CWebSocket)) {
            $.get('https://' + this.host + ':' + this.port)
                .always(function () {

                    // CONNEXION WEBSOCKET CLIENT
                    clientWs = new W3CWebSocket('wss://' + this.host + ':' + this.port);

                    // ERREUR
                    clientWs.onerror = function () {
                        console.warn('Connection Error');
                        clientWs = null;
                        // Callback connexion error
                        onError();
                    }.bind(this);

                    // CONNECTION OPEN
                    clientWs.onopen = function () {
                        console.log('WebSocket Client Connected %o', clientWs);

                        if (clientWs.readyState === clientWs.OPEN) {
                            // We say the server we are a webbrowser
                            clientWs.send(JSON.stringify(messages.supervisionConnection()));
                            // callback connexion OK
                            onConnexion(clientWs);
                        }
                    }.bind(this);

                    // CONNECTION CLOSE
                    clientWs.onclose = function () {
                        clientWs = null;
                    }.bind(this);

                    // MESSAGE REÇU
                    clientWs.onmessage = function (e) {
                        if (typeof e.data === 'string') {

                            var message = {};
                            // 1 - Parsing the JSON
                            try {
                                // JSON decode
                                message = JSON.parse(e.data);
                            }
                                // No JSON format
                            catch (e) {
                                console.log('error, Message is not a valid JSON : %o', e);
                                return;
                            }

                            // 2 - Message has a messageType key
                            if (message.messageType) {
                                switch (message.messageType) {
                                    case 'init_parking_finished':
                                        console.log('ACTION init_parking_finished');
                                        Actions.com.init_parking_finished();
                                        break;
                                    default:
                                        console.log('No message type : ', message.messageType);
                                        break;
                                }
                            }
                            // 2 BIS - Message doesn't have a messageType key
                            else {
                                // Trace
                                console.log('info, Query without messageType: ' + message);
                            }
                        }
                    }.bind(this);
                }.bind(this));
        } else {
            console.log('On a deja un websocket !!');
        }
    }

};

var messages = ({
    /***************************************************************
     *************** CONTROLLER CONFIGURATION ************************
     ***************************************************************/

    initParking: function () {
        return {
            messageType: 'init_parking',
            data: {}
        };
    },
    /**
     * Client send hello
     * @returns {{messageType: string, data: {toto: string}}}
     */
    supervisionConnection: function () {
        var retour = {
            messageType: 'supervisionConnection',
            data: {}
        };
        return retour;
    },

    /**
     * Communication server configures the controller
     * @param host: controller host
     * @param port: port used to communicate
     * @param timeZone: time zone
     * @param syslogServer: log server adress
     */
    configuration: function (host, port, timeZone, syslogServer) {

        var retour = {
            messageType: 'configuration',
            data: {
                serverURL: "wss://" + host + ":" + port + "/",
                timezone: "Europe/Berlin",
                syslogServer: syslogServer
            }
        };
        return retour;
    },

    /**
     * Send a command to the controller
     * @param command:
     * - reset
     * - initialize
     * @returns {{messageType: string, data: {command: *}}}
     */
    remoteControl: function (command) {
        return {
            messageType: "remoteControl",
            "data": {
                command: command
            }
        }
    },


    /***************************************************************
     *************** DATABASE CONFIGURATION ************************
     ***************************************************************/

    busConfigQuery: function (data) {
        return {
            messageType: "busConfigQuery",
            data: data
        }
    }


});
module.exports.messages = messages;