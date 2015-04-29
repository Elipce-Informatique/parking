/**
 * Created by yann on 21/04/2015.
 */
var _ = require('lodash');

module.exports.refreshPlaces = {
    _timer: false,
    _planId: 0,
    _journalId: 0,
    init: function (planId, journalId) {
        if (!this._timer) {
            this._timer = setInterval(this._handleAjax.bind(this), 5000);
            this._planId = planId;
            this._journalId = journalId;
        }
    },

    /**
     * Récupère les informations sur les places et déclenche l'action
     * @private
     */
    _handleAjax: function () {
        $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/journal_place/' + this._planId + '/' + this._journalId,
            context: this
        })
            .done(function (data) {
                // ON A DES NOUVELLES DONNÉES
                if (data.length) {
                    Actions.map.refresh_places(data);
                    _.each(data, function (p, i) {
                        this._journalId = Math.max(this._journalId, p.latest_journal_equipement.id);
                    }, this);
                }
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                alert("ajax error response error " + type);
                alert("ajax error response body " + xhr.responseText);
            });
    }
};