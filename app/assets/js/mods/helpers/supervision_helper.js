/**
 * Created by yann on 21/04/2015.
 */

module.exports.refreshPlaces = {
    _timer: false,
    _parkingId: 0,
    _journalId: 0,
    init: function (parkingId, journalId) {
        console.log('Timer : %o', this._timer);
        if (!this._timer) {
            this._timer = setInterval(this._handleAjax, 5000);
            this._parkingId = parkingId;
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
            url: BASE_URI + 'parking/journal_place/' + this._parkingId + '/' + this._journalId
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