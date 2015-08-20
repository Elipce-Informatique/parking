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
     * @param onConnexion : function avec en paramètre le client de websocket connecté
     * @param onError : function appellée lors d'une erreur de connexion
     */
    initWebSocket: function (parkingId, onConnexion, onError) {

        // Read and store confg
        this.host = conf[parkingId].host;
        this.port = conf[parkingId].port;

        if (window.clientWs === null && !(window.clientWs instanceof W3CWebSocket)) {
            $.get('https://' + this.host + ':' + this.port)
                .always(function () {
                    // CONNEXION WEBSOCKET CLIENT
                    window.clientWs = new W3CWebSocket('wss://' + this.host + ':' + this.port);

                    // ERREUR
                    window.clientWs.onerror = function (err) {
                        console.warn('Connection Error');
                        window.clientWs = null;
                        // Callback connexion error
                        onError(err);
                    }.bind(this);

                    // CONNECTION OPEN
                    window.clientWs.onopen = function () {
                        console.log('WebSocket Client Connected %o', window.clientWs);

                        if (window.clientWs.readyState === window.clientWs.OPEN) {
                            // We say the server we are a webbrowser
                            window.clientWs.send(JSON.stringify(messages.supervisionConnection()));
                            // callback connexion OK
                            onConnexion(window.clientWs);
                        }
                    }.bind(this);

                    // CONNECTION CLOSE
                    window.clientWs.onclose = function () {
                        window.clientWs = null;
                    }.bind(this);

                    // MESSAGE REÇU
                    /**
                     *
                     * @type {function(this:module.exports.client)|*}
                     */
                    window.clientWs.onmessage = function (e) {
                        if (typeof e.data === 'string') {

                            var message = {};
                            // 1 - Parsing the JSON
                            try {
                                // JSON decode
                                message = JSON.parse(e.data);
                            }
                                // No JSON format
                            catch (err) {
                                console.warn('error, Message is not a valid JSON : %o', e);
                                return;
                            }

                            // 2 - Message has a messageType key
                            if (message.messageType) {
                                Actions.com.message_controller(message);
                            }
                            // 2 BIS - Message doesn't have a messageType key
                            else {
                                // Trace
                                console.warn('info, Query without messageType: ' + message);
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