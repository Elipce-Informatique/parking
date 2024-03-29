/**
 * Created by yann on 20/08/2015.
 */

var com_helper = require('./com_helper');
var form_data_helper = require('./form_data_helper');
var W3CWebSocket = require('websocket').w3cwebsocket;

module.exports = {

    _timer: false,
    _displayDFU: false,
    _sensorDFU: false,
    _planId: 0,
    _journalId: 0,
    _parkingId: 0,
    _journalAlerteId: 0,
    _ajaxInstances: {},
    _unsubscribe: null,
    _unsubscribeParkingState: null,
    _viewsIdToUpdate: [],
    _ajaxViewInstances: {},


    /**
     * Init supervision lors de la sélection d'un plan + Ecoute des actions du serveur WS
     * @param planId
     * @param journalId
     * @param parkingId
     * @param journalAlerteId
     * @param onConnexion
     * @param onError
     */
    init: function (planId, journalId, parkingId, journalAlerteId, onConnexion, onError) {
        // INIT DATA
        this._planId = planId;
        this._journalId = journalId;
        this._parkingId = parkingId;
        this._journalAlerteId = journalAlerteId;
        this.destroyTimerPlaces();


        // WS déjà connecté
        if (window.clientWs !== null) {
            // Listen equipment events
            this._listenEquipmentEvents();
        }
        else {
            // CONNEXION AU WEBSOCKET ET ÉCOUTE DES MESSAGES QUI NOUS INTÉRESSENT
            com_helper.client.initWebSocket(parkingId, function (client) {
                // Listen equipment events
                this._listenEquipmentEvents();

                // Give the client in a callback
                if (onConnexion !== undefined) {
                    onConnexion(client);
                }

                //console.log('LISTEN MESSAGE CTRL');
            }.bind(this), function (err) {
                console.warn('Erreur de connexion au WS : %o', err);
                swal(Lang.get('global.com.errConnServer'));
                if (onError !== undefined) {
                    onError(err);
                }
            });
        }

        // Mises à jour de la supervision toutes les 3sec si on a reçu un message du controller
        if (!this._timer) {
            this._timer = setInterval(this.timerUpdate.bind(this), 3000);
        }
    },

    /**
     * Ecoute les évènements capteur et afficheur envoyés par le controller
     * @private
     */
    _listenEquipmentEvents: function () {

        if (this._unsubscribe != null && typeof this._unsubscribe === "function") {
            this._unsubscribe();
        }
        this._unsubscribe = Actions.com.message_controller.listen(this._onWSMessage.bind(this));
    },

    /**
     * Fonction appellée lorsqu'un message est reçu dans la chaussette web
     * @param message : object {messageType: '', data: {}}
     */
    _onWSMessage: function (message) {

        switch (message.messageType) {
            case "sensor_event":
                // UPDATE TOUT LE BAZAR
                this._sensorDFU = true;
                break;
            case "view_event":
                // UPDATE DISPLAYS in the data
                //console.log('MESSAGE %o', message);
                this._handleViewEvent(message.data);
                break;
            default:
                break;
        }
    },

    /**
     * Toutes les 3 sec on regarde si on a une mise à jour sensor ou display à faire
     * IMPORTANT car lorsqu'on dépile les evts du controller, tout est abort car tout arrive en masse.
     */
    timerUpdate: function () {
        // Abord AJAX si on doit en relancer
        this._displayDFU ? this._abortViewAjax() : null;
        this._sensorDFU ? this._abortAjax() : null;

        if (this._sensorDFU) {
            this._sensorDFU = false;
            this._handleAjax();
        }
        if (this._displayDFU) {
            this._displayDFU = false;
            this._handleViewAJAX();
        }
    },

    /**
     * Connexion au serveur de WS + Ecoute de l'action parking_state du serveur WS
     * @param parkingId
     * @param onConnexion
     * @param onError
     */
    initParkingState: function (parkingId, onConnexion, onError) {
        // WS déjà connecté
        if (window.clientWs !== null) {
            // Listen parking events
            this._listenParkingState();
        }
        else {
            // CONNEXION AU WEBSOCKET ET ÉCOUTE DES MESSAGES QUI NOUS INTÉRESSENT
            com_helper.client.initWebSocket(parkingId, function (client) {

                // Listen parking events
                this._listenParkingState();

                // Give the client in a callback
                if (onConnexion !== undefined) {
                    onConnexion(client);
                }

                //console.log('LISTEN MESSAGE CTRL');
            }.bind(this), function (err) {
                console.warn('Erreur de connexion au WS : %o', err);
                swal(Lang.get('global.com.errConnServer'));
                if (onError !== undefined) {
                    onError(err);
                }
            });
        }
    },

    /**
     * Listen parking state messages from controller +
     * @private
     */
    _listenParkingState: function () {
        if (this._unsubscribeParkingState != null && typeof this._unsubscribeParkingState === "function") {
            this._unsubscribeParkingState();
        }
        this._unsubscribeParkingState = Actions.com.message_controller.listen(function (message) {
            // Parking state
            if (message.messageType == "parking_state") {
                this._handleParkingState(message.data);
            }
        }.bind(this));
    },

    /**
     * Récupère les informations sur les places et déclenche l'action
     * @private
     */
    _handleAjax: function () {
        // 1 - UPDATE TABLEAU DE BORD EN PARALLÈLE
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
    _abortAjax: function () {
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
        //console.log('ID views %o', idViews);
        // Merge array views to update
        this._viewsIdToUpdate = _.unique(this._viewsIdToUpdate.concat(idViews));
        this._displayDFU = true;
    },

    _handleViewAJAX: function () {
        // Data ajax
        var dataAjax = {
            ids: _.clone(this._viewsIdToUpdate)
        };

        // At least 1 display to update
        if (dataAjax.ids.length > 0) {
            // Get displays infos
            this._ajaxViewInstances['0'] = $.ajax({
                method: 'GET',
                url: BASE_URI + 'parking/afficheur/updateAfficheurs',
                dataType: 'json',
                context: this,
                data: dataAjax,
                global: false
            })
                .done(function (data) {
                    // Nouveaux ids à rafraichir
                    this._viewsIdToUpdate = _.unique(_.difference(this._viewsIdToUpdate, dataAjax.ids));
                    // Views to update processed
                    // Refresh afficheurs on the map
                    Actions.map.refresh_afficheurs(data);
                })
                .fail(function (xhr, type, exception) {
                    // Abort effectué par nos soins pour ne pas rafraichir tant que la précédent refresh n'est pas fini.
                    if (type !== 'abort') {
                        // if ajax fails display error alert
                        console.error("ajax error response error " + type);
                        console.error("ajax error response body " + xhr.responsetext);
                    }
                    else {
                        this._viewsIdToUpdate = [];
                    }
                });
        }
    },

    /**
     * Annule toutes les requêtes ajax en cours de type view
     */
    _abortViewAjax: function () {
        // Parse instances
        _.each(this._ajaxViewInstances, function ($req) {
            $req.abort();
        });
    },

    /**
     * Met à jour le state dans la BDD et informe la supervision
     * @param data
     * @private
     */
    _handleParkingState: function (data) {
        //console.log('_handleParkingState() %o', data);
        // FormData
        var fData = form_data_helper('', 'PUT');
        fData.append('etat', data.etat)

        // Requête
        // TODO creer route update etat
        $.ajax({
            url: BASE_URI + 'parking/gestion_parking/update_state/' + data.id,
            type: 'POST',
            data: fData,
            processData: false,
            contentType: false,
            dataType: 'json',
            context: this,
            success: function (data) {
                //console.log('retour ajax %o',data);
                // Send information to supervision page
                Actions.supervision.parking_state_update(data);

            },

            error: function (xhr, status, err) {
                console.error(status, err.toString());
                Actions.notif.error('AJAX : ' + Lang.get('global.notif_erreur'));
            }
        });
    }
};