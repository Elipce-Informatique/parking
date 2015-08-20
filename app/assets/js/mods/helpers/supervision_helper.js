/**
 * Created by yann on 20/08/2015.
 */

var com_helper = require('./com_helper');

module.exports = {

    _timer: false,
    _planId: 0,
    _journalId: 0,
    _parkingId: 0,
    _journalAlerteId: 0,
    _ajaxInstances: {},
    _unsubscribe: null,


    init: function (planId, journalId, parkingId, journalAlerteId) {
        // INIT DATA
        this._planId = planId;
        this._journalId = journalId;
        this._parkingId = parkingId;
        this._journalAlerteId = journalAlerteId;
        //this.destroyTimerPlaces();

        // CONNEXION AU WEBSOCKET ET ÉCOUTE DES MESSAGES QUI NOUS INTÉRESSENT
        com_helper.client.initWebSocket(parkingId, function (client) {

            if (this._unsubscribe != null && typeof this._unsubscribe === "function") {
                console.log('Unsubscribe le ws');
                this._unsubscribe();
            }
            this._unsubscribe = Actions.com.message_controller.listen(this._onWSMessage);
        }, function (err) {
            console.warn('Erreur de connexion au WS : %o', err);
            swal(Lang.get('global.com.errConnServer'));
        });
        // MODE TEST AJAX
        //if (!this._timer) {
        //    this._timer = setInterval(this._handleAjax.bind(this), 5000);
        //}
    },

    /**
     * TODO
     * Fonction appellée lorsqu'un message est reçu dans la chaussette web
     * @param message : object {messageType: '', data: {}}
     */
    _onWSMessage: function (message) {
        if (message.messageType == "") {

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
    destroyTimerPlaces: function () {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = false;
        }
    },
    /**
     * Annule toutes les requêtes ajax en cours
     */
    abortAjax: function () {
        _.each(this._ajaxInstances, function ($req) {
            $req.abort();
        });
    }
};