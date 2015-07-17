/**
 * Created by yann on 21/04/2015.
 *
 */
var com_helper = require('../helpers/com_helper.js');

/**
 * Gère le rafraichissement des données de la supervision
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

    init: function (planId, journalId, parkingId, journalAlerteId) {
        // INIT DATA
        this._planId = planId;
        this._journalId = journalId;
        this._parkingId = parkingId;
        this._journalAlerteId = journalAlerteId;

        // MODE REEL
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

    initWebSocket: function () {
        // Connexion websocket client
        var client = new W3CWebSocket('ws://' + this.host + ':' + this.port);

        // ERREUR
        client.onerror = function () {
            console.log('Connection Error');
        };

        // CONNECTION OPEN
        client.onopen = function () {
            console.log('WebSocket Client Connected %o', client);

            if (client.readyState === client.OPEN) {
                console.log('send capabilities');
                client.send(JSON.stringify(com_helper.capabilities()));
            }
        };

        // CONNECTION CLOSE
        client.onclose = function () {
            console.log('echo-protocol Client Closed - Tentative reconnexion');
            // reconnexion
            client = new W3CWebSocket('ws://' + this.host + ':' + this.port);
        }.bind(this);

        // MESSAGE REÇU
        client.onmessage = function (e) {
            if (typeof e.data === 'string') {
                console.log("Received: '" + e.data + "'");
            }
        };
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
            url: BASE_URI + 'parking/journal_alerte/' + this._parkingId + '/' + this._journalAlerteId,
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