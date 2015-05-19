/**
 * Created by yann on 04/05/2015.
 */

var _ = require('lodash');
var mapHelper = require('./map_helper');
var formDataHelper = require('./form_data_helper');

/**
 * Tests initiaux à la création d'une allée :
 * Chevauche une autre zone ? => KO
 * Chevauche une allée ? => KO
 * Contenue dans une autre allée ? => KO
 *
 * @param newAllee : La nouvelle allée à tester
 * @param zones : Tableau des zones. Chaque zone est un tablau de latlng
 * @param allees : Tableau des zones. Chaque zone est un tablau de latlng
 */
function geometryCheck(newAllee, zones, allees) {

    var isValid = true;
    var message = "";

    // VAGUE DE TEST SUR LES ZONES
    _.each(zones, function (z) {
        // I - CHEVAUCHE UNE ZONE ?
        if (mapHelper.polygonIntersection(newAllee, z)) {
            isValid = false;
            message = Lang.get('administration_parking.carte.err_zone_chevauche');
            return false; // Break the each
        }
    });

    // ON S'ÉPARGNE LES TESTS INUTILES
    if (isValid) {
        // VAGUE DE TEST SUR LES ALLÉES
        _.each(allees, function (a) {
            // II - CHEVAUCHE UNE ALLEE ?
            if (mapHelper.polygonIntersection(newAllee, a)) {
                isValid = false;
                message = Lang.get('administration_parking.carte.err_allee_chevauche');
                return false; // Break the each
            }
            // II - CONTENU DANS UNE AUTRE ALLEE ?
            if (mapHelper.polygonContainsPolygon(a, newAllee)) {
                isValid = false;
                message = Lang.get('administration_parking.carte.err_allee_contenue_allee');
                return false; // Break the each
            }
        });
    }

    // Affichage du message si erreur
    if (!isValid) {
        swal(message);
    }
    return isValid;
}

/*****************************************************************************************************
 * VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
 * CRÉE UNE ALLEE EN BDD EN FONCTION DES INORMATIONS DE LA POPUP.
 *
 * @param formDom : DOM du formulaire
 * @param allee : Allée à enregistrer (format layer Leaflet)
 * @param _inst : données d'instance du store
 */
function createAllee(formDom, allee, _inst) {
    console.log('CreateAllee avec %o', arguments);

    // Une allée contient la zone ?
    var zoneWrapper = getZoneWrapper(formDom, allee, _inst);
    var geoJson = allee.e.layer.toGeoJSON();

    var data = {};

    // ALLÉE HORS ZONE : Zone par défaut
    if (zoneWrapper.length != 1) {
        console.log('Pass zone défaut');
        var defaultZoneId = _inst.defaults.zone.id;
        data = {
            allee_geojson: geoJson,
            zone_id: defaultZoneId
        };
    }

    // ALLÉE DANS UNE ZONE : Attachée à ladite zone
    else {
        data = {
            allee_geojson: geoJson,
            zone_id: zoneWrapper[0].id
        };
    }

    // DANS TOUS LES CAS ATTACHER LES PLACES CONTENUES DANS L'ALLÉE
    var places = mapHelper.getPlacesInAllee(allee, _inst);
    data['places'] = places;

    console.log('Data allée = %o', data);
    insertAllee(formDom, data);
}


/**
 * Effectue l'appel AJAX pour insérer la zone en BDD en fonction des params
 * @param formDom
 * @param data
 */
function insertAllee(formDom, data) {
    // CONSTRUCTION DE l'AJAX DE CRÉATION
    var fData = formDataHelper('form_mod_allee', 'POST');
    fData.append('data', JSON.stringify(data));

    $.ajax({
        type: 'POST',
        url: BASE_URI + 'parking/allee',
        processData: false,
        contentType: false,
        data: fData
    })
        .done(function (data) {
            var isValide = JSON.parse(data);
            isValide ? Actions.notif.success() : Actions.notif.error();
        })
        .fail(function (xhr, type, exception) {
            // if ajax fails display error alert
            alert("ajax error response error " + type);
            alert("ajax error response body " + xhr.responseText);
        });
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//******************************************************************************************************

function getZoneWrapper(formDom, allee, _inst) {
    var allZones = mapHelper.getFeaturesArrayFromLeafletLayerGroup(_inst.mapInst.zonesGroup);

    // ZONE QUI CONTIENT L'ALLÉE
    var zoneContainAllee = _.filter(allZones, function (zone) {
        console.log('Layer = %o', allee.e.layer);
        return mapHelper.polygonContainsPolygon(zone._latlngs, allee.e.layer._latlngs);
    });

    console.log('Zone Contenant l\'allée : %o', zoneContainAllee);

    // EXTRACTION DE LA PROPRIÉTÉ DATA POUR ÉVITER LA REDONDANCE LIÉE À LA MAP.
    zoneContainAllee = _.map(zoneContainAllee, function (zone) {
        return zone.options.data;
    });

    return zoneContainAllee;
}

/**
 * Interface publique du module
 */
module.exports = {
    geometryCheck: geometryCheck,
    createAllee: createAllee
};
