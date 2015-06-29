var mapHelper = require('./map_helper');
var jh = require('./json_helper');
var formDataHelper = require('./form_data_helper');


var alerte = ({
    /**
     *
     * @param formDom: DOM du form alerte full
     * @param zone: zone dessinée par le user
     * @param _inst: toutes les instances de carte (layer ...)
     * @param callback: fonction de callback si création alrte BDD OK
     */
    createZone: function (formDom, zone, _inst, callback) {

        // Zone dessinée par user
        var geoJson = JSON.stringify(zone.e.layer._latlngs);

        // TODO get places in zone

        var data = {
            zone_geojson: geoJson,
            plan_id: _inst.planInfos.id,
            code : 'full'
        };

        // CONSTRUCTION DE l'AJAX DE CRÉATION
        var fData = formDataHelper('form_alerte_full', 'POST');
        fData.append('data', JSON.stringify(data));

        $.ajax({
            type: 'POST',
            url: BASE_URI + 'parking/alerte',
            processData: false,
            contentType: false,
            data: fData
        })
        .done(function (data) {
            callback(data);
        })
        .fail(function (xhr, type, exception) {
            // if ajax fails display error alert
            console.error("ajax error response error " + type);
            console.error("ajax error response body " + xhr.responseText);
        });
    }
});

module.exports = alerte;
