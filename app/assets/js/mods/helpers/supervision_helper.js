/**
 * Created by yann on 20/08/2015.
 */

var com_helper = require('./com_helper');
var form_data_helper = require('./form_data_helper');

module.exports = {

    _timer: false,
    _planId: 0,
    _journalId: 0,
    _parkingId: 0,
    _journalAlerteId: 0,
    _ajaxInstances: {},
    _unsubscribe: null,
    _viewsIdToUpdate: [],
    _ajaxViewInstances: {},


    init: function (planId, journalId, parkingId, journalAlerteId, onConnexion, onError) {
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
            this._unsubscribe = Actions.com.message_controller.listen(this._onWSMessage.bind(this));

            // Give the client in a callback
            onConnexion(client);

            //console.log('LISTEN MESSAGE CTRL');
        }.bind(this), function (err) {
            console.warn('Erreur de connexion au WS : %o', err);
            swal(Lang.get('global.com.errConnServer'));
            onError(err);
        });
        // MODE TEST AJAX
        //if (!this._timer) {
        //    this._timer = setInterval(this._handleAjax.bind(this), 5000);
        //}
    },

    /**
     * Fonction appellée lorsqu'un message est reçu dans la chaussette web
     * @param message : object {messageType: '', data: {}}
     */
    _onWSMessage: function (message) {

        console.log('ON RECOIT UN EVENT DU CONTROLLER, GO UPDATE LA SUPERVIION  !!!!! %o', message);
        switch (message.messageType) {
            case "sensor_event":
                // UPDATE TOUT LE BAZAR
                this._handleAjax();
                break;
            case "view_event":
                this._handleViewEvent(message.data);
                break;
            default:
                break;
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
                // Abort effectué par nos soins pour ne pas rafraichir tant que la précédent refresh n'est pas fini.
                if (type !== 'abort') {
                    // if ajax fails display error alert
                    console.error("ajax error response error " + type);
                    console.error("ajax error response body " + xhr.responseText);
                }
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
                // Abort effectué par nos soins pour ne pas rafraichir tant que la précédent refresh n'est pas fini.
                if (type !== 'abort') {
                    // if ajax fails display error alert
                    console.error("ajax error response error " + type);
                    console.error("ajax error response body " + xhr.responsetext);
                }
            });
    },
    destroyTimerPlaces: function () {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = false;
        }
    },
    /**
     * Annule toutes les requêtes ajax en cours de type sensor
     */
    abortAjax: function () {
        _.each(this._ajaxInstances, function ($req) {
            $req.abort();
        });
    },

    /**
     * Events view from controller
     * @param idViews: array ID vue
     * @returns {*}
     * @private
     */
    _handleViewEvent: function (idViews) {
        // console.log('ID views %o', idViews);
        // Merge array views to update
        this._viewsIdToUpdate = this._viewsIdToUpdate.concat(idViews);

        // Refresh View en cours
        this.abortViewAjax();

        // Data ajax
        var data = {
            ids: this._viewsIdToUpdate
        };

        // Get displays infos
        this._ajaxViewInstances['0'] = $.ajax({
            method: 'GET',
            url: BASE_URI + 'parking/afficheur/updateAfficheurs',
            dataType: 'json',
            context: this,
            data: data,
            global: false
        })
            .done(function (data) {
                console.log('ANSWER DISPLAYS  %o', data);
                // Refresh afficheurs on the map
                Actions.map.refresh_afficheurs(data);
                // Views to update processed
                this._viewsIdToUpdate = [];
            })
            .fail(function (xhr, type, exception) {
                // Abort effectué par nos soins pour ne pas rafraichir tant que la précédent refresh n'est pas fini.
                if (type !== 'abort') {
                    // if ajax fails display error alert
                    console.error("ajax error response error " + type);
                    console.error("ajax error response body " + xhr.responsetext);
                }
            });
    },

    /**
     * Annule toutes les requêtes ajax en cours de type view
     */
    abortViewAjax: function () {
        // Parse instances
        _.each(this._ajaxViewInstances, function ($req) {
            $req.abort();
        });
    }
};