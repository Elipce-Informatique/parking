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
    createAlerteFull: function (formDom, zone, _inst, callback) {

        // Zone dessinée par user
        var geoJson = JSON.stringify(zone.e.layer._latlngs);

        // Les places de la zone
        var places = mapHelper.getPlacesInZone(zone, _inst);
        //console.log('places %o', places);

        var data = {
            places: places,
            zone_geojson: geoJson,
            plan_id: _inst.planInfos.id,
            code : 'full'
        };

        // CONSTRUCTION DE l'AJAX DE CRÉATION
        var fData = formDataHelper('form_alerte_full', 'POST');
        fData.append('data', JSON.stringify(data));
        fData.append('plan_id', _inst.planInfos.id);
        fData.append('geojson', geoJson);

        $.ajax({
            type: 'POST',
            url: BASE_URI + 'parking/alerte',
            processData: false,
            contentType: false,
            dataType: 'json',
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
