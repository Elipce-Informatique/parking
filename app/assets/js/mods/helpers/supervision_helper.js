/**
 * Created by yann on 21/04/2015.
 *
 */
var com_helper = require('../helpers/com_helper.js');
var W3CWebSocket = require('websocket').w3cwebsocket;

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

    modeDev: false,
    host: '85.14.137.12',
    port: 26000,
    client: {},

    init: function (planId, journalId, parkingId, journalAlerteId) {
        // INIT DATA
        this._planId = planId;
        this._journalId = journalId;
        this._parkingId = parkingId;
        this._journalAlerteId = journalAlerteId;

        //// MODE REEL
        Actions.supervision.parking_event.listen(this._handleAjax.bind(this));
        this.initWebSocket();

        // MODE TEST AJAX
        //if (!this._timer) {
        //    this._timer = setInterval(this._handleAjax.bind(this), 5000);
        //}
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
    initWebSocket: function () {

        if (_.isEqual(this.client, {}) && !(this.client instanceof W3CWebSocket)) {
            $.get('https://' + this.host + ':' + this.port)
                .always(function () {

                    // CONNEXION WEBSOCKET CLIENT
                    this.client = new W3CWebSocket('wss://' + this.host + ':' + this.port);

                    // ERREUR
                    this.client.onerror = function () {
                        console.warn('Connection Error');
                        this.client = {};
                    }.bind(this);

                    // CONNECTION OPEN
                    this.client.onopen = function () {
                        console.log('WebSocket Client Connected %o', this.client);

                        if (this.client.readyState === this.client.OPEN) {
                            console.log('send supervision_connection');
                            this.client.send(JSON.stringify(com_helper.supervisionConnection()));
                        }
                    }.bind(this);

                    // CONNECTION CLOSE
                    this.client.onclose = function () {
                        this.client = {};
                    }.bind(this);

                    // MESSAGE REÇU
                    this.client.onmessage = function (e) {
                        if (typeof e.data === 'string') {
                            console.log("W3CWebSocket MESSAGE RECEIVED : '" + e.data + "'");
                            var message = JSON.parse(e.data);
                            console.log("W3CWebSocket MESSAGE PARSED : %o", data);
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