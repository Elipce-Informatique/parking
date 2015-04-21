/**
 * Created by yann on 21/04/2015.
 */

module.exports.refreshPlaces = {
    _timer: false,
    _niveauId: 0,
    _journalId: 0,
    init: function (nievauId, journalId) {
        if (!this._timer) {
            this._timer = setInterval(this._handleAjax.bind(this), 5000);
            this._niveauId = nievauId;
            this._journalId = journalId;
        }
    },

    /**
     *
     * @private
     */
    _handleAjax: function () {
        $.ajax({
            type: 'GET',
            url: BASE_URI + 'parking/journal_place/' + this._niveauId + '/' + this._journalId
        })
            .done(function (data) {
                console.log('Retour rafraichissement : %o', data);
            })
            .fail(function (xhr, type, exception) {
                // if ajax fails display error alert
                alert("ajax error response error " + type);
                alert("ajax error response body " + xhr.responseText);
            });
    }
};