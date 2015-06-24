/**
 * Created by yann on 04/05/2015.
 */

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
            message = Lang.get('administration_parking.carte.err_allee_chevauche_zone');
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
 * @param callback : function appellée lors du retour AJAX de l'insertion
 */
function createAllee(formDom, allee, _inst, callback) {

    // Une allée contient la zone ?
    var zoneWrapper = getZoneWrapper(formDom, allee, _inst);
    var geoJson = JSON.stringify(allee.e.layer._latlngs);

    var data = {};

    // ALLÉE HORS ZONE : Zone par défaut
    if (zoneWrapper.length != 1) {
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
    var places = mapHelper.getPlacesInAllee(allee.e.layer, _inst);
    data['places'] = places;

    insertAllee(formDom, data, callback);
}


/**
 * Effectue l'appel AJAX pour insérer la zone en BDD en fonction des params
 * @param formDom
 * @param data
 * @param callback : function appellée lors du retour AJAX de l'insertion
 */
function insertAllee(formDom, data, callback) {
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
            callback(data);
        })
        .fail(function (xhr, type, exception) {
            // if ajax fails display error alert
            console.error("ajax error response error " + type);
            console.error("ajax error response body " + xhr.responseText);
        });
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//******************************************************************************************************

function getZoneWrapper(formDom, allee, _inst) {
    var allZones = mapHelper.getFeaturesArrayFromLeafletLayerGroup(_inst.mapInst.zonesGroup);

    // ZONE QUI CONTIENT L'ALLÉE
    var zoneContainAllee = _.filter(allZones, function (zone) {
        return mapHelper.polygonContainsPolygon(zone._latlngs, allee.e.layer._latlngs);
    });

    // EXTRACTION DE LA PROPRIÉTÉ DATA POUR ÉVITER LA REDONDANCE LIÉE À LA MAP.
    zoneContainAllee = _.map(zoneContainAllee, function (zone) {
        return zone.options.data;
    });

    return zoneContainAllee;
}

/**
 * Crée les allees à afficher sur la map en fonction d'un tableau de places venant directement de la BDD
 *
 * @param alleesBDD : tableau d'objet de type allee sorti d'Eloquent.
 * @param alleeStyle : style à appliquer sur les allees
 * @returns : tableau de allees prêt pour le trigger vers la map
 */
function createAlleesMapFromAlleesBDD(alleesBDD, alleeStyle) {
    return _.map(alleesBDD, function (a) {
        if (a.geojson != "") {
            var extraData = a;
            var polygon = mapHelper.createFeatureFromCoordinates(JSON.parse(a.geojson), extraData, alleeStyle);
            polygon.bindLabel(a.libelle);

            return {
                data: a,
                polygon: polygon
            };
        } else {
            return null;
        }
    }, this);
}

/**
 * Interface publique du module
 */
module.exports = {
    geometryCheck: geometryCheck,
    createAllee: createAllee,
    createAlleesMapFromAlleesBDD: createAlleesMapFromAlleesBDD,
    style: {
        color: '#1e90ff',
        weight: 2,
        opacity: 0.65,
        fillOpacity: 0.15,
        fillColor: '#1e90ff'
    }
};
