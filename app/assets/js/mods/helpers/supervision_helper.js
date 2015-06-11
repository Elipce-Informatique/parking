/**
 * Created by yann on 21/04/2015.
 *
 */
var _ = require('lodash');

/**
 * Gère le rafraichissement des données de la supervision
 *
 */
module.exports.refreshJournalEquipement = {
    _timer: false,
    _planId: 0,
    _journalId: 0,
    _parkingId: 0,
    init: function (planId, journalId, parkingId) {
        if (!this._timer) {
            this._timer = setInterval(this._handleAjax.bind(this), 5000);
            this._planId = planId;
            this._journalId = journalId;
            this._parkingId = parkingId;
        }
    }
    ,
    destroyPlaces: function () {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = false;
        }
    }
    ,

    /**
     * Récupère les informations sur les places et déclenche l'action
     * @private
     */
    _handleAjax: function () {
        // UPDATE TABLEAU DE BORD EN PARALLÈLE
        Actions.supervision.tableau_bord_update(this._parkingId);

        // UPDATE PLAN ET SIDEBAR
        $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/journal_place/' + this._planId + '/' + this._journalId,
            context: this,
            global: false
        })
            .done(function (data) {
                // ON A DES NOUVELLES DONNÉES
                if (data.length) {
                    Actions.map.refresh_places(data);
                    Actions.supervision.temps_reel_update(data);

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
    }
}
;