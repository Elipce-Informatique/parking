var W3CWebSocket = require('websocket').w3cwebsocket;
var conf = require('../../config/config.js');
/**
 * Gère le rafraichissement des données de la supervision.
 *
 */
module.exports.refresh = {
    _timer: false,
    _planId: 0,
    _journalId: 0,
    _parkingId: 0,
    _journalAlerteId: 0,
    _ajaxInstances: {},

    host: null,
    port: null,
    client: {},

    /**
     * Save parameters as data and try to connect to server
     * @param planId
     * @param journalId
     * @param parkingId
     * @param journalAlerteId
     */
    init: function (planId, journalId, parkingId, journalAlerteId, onConnexion, onError) {
        // INIT DATA
        this._planId = planId;
        this._journalId = journalId;
        this._parkingId = parkingId;
        this._journalAlerteId = journalAlerteId;
        this.host = conf[this._parkingId].host;
        this.port = conf[this._parkingId].port;

        //// MODE REEL
        Actions.supervision.parking_event.listen(this._handleAjax.bind(this));
        this.initWebSocket(onConnexion, onError);
    },

    destroyTimerPlaces: function () {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = false;
        }
    },

    /**
     * Opens a secured websocket on the communication server.
     */
    initWebSocket: function (onConnexion, onError) {

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
                                switch(message.messageType){
                                    case 'init_parking_finished':
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
    },

    /**
     * Récupère les informations sur les places et déclenche l'action
     * @private
     */
    _handleAjax: function () {
        // 1 - UPDATE TABLEAU DE BORD EN PARALLÈLE
        this.abortAjax();
        Actions.supervision.tableau_bord_update(this._parkingId);

        // --------------------------------------
        // 2 - UPDATE PLAN ET JOURNAL SIDEBAR
        this._ajaxInstances['1'] = $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/journal_place/' + this._planId + '/' + this._journalId,
            context: this,
            global: false
        })
            .done(function (data) {
                // ON A DES NOUVELLES DONNÉES
                if (data.length) {
                    // 2.1 - UPDATE PLACES CARTE
                    Actions.map.refresh_places(data, this._planId);
                    // 2.2 - UPDATE JOURNAL TEMPS REEL
                    Actions.supervision.temps_reel_update_journal(data);

                    // Calcul du prochain nouvel ID journal
                    _.each(data, function (p, i) {
                        this._journalId = Math.max(this._journalId, p.latest_journal_equipement.id);
                    }, this);
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responseText);
            });

        // --------------------------------------------------------
        // 3 - UPDATE ALERTES SIDEBAR
        this._ajaxInstances['2'] = $.ajax({
            type: 'get',
            url: BASE_URI + 'parking/journal_alerte/' + this._planId + '/' + this._journalAlerteId,
            processdata: false,
            contenttype: false,
            data: {},
            context: this,
            global: false
        })
            .done(function (data) {
                if (data.length) {
                    Actions.supervision.temps_reel_update_alertes(data);

                    // Calcul du prochain nouvel ID journal
                    _.each(data, function (p, i) {
                        this._journalAlerteId = Math.max(this._journalAlerteId, p.id);
                    }, this);
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                console.error("ajax error response error " + type);
                console.error("ajax error response body " + xhr.responsetext);
            });
    },

    /**
     * Annule toutes les requêtes ajax en cours
     */
    abortAjax: function () {
        _.each(this._ajaxInstances, function ($req) {
            $req.abort();
        });
    }
}
;

var messages = ({

    /***************************************************************
     *************** CONTROLLER CONFIGURATION ************************
     ***************************************************************/

    initParking: function(){
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
        }
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