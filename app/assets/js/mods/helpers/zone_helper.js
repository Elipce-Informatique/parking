/**
 * Created by yann on 04/05/2015.
 */
var _ = require('lodash');
var mapHelper = require('./map_helper');
var formDataHelper = require('./form_data_helper');

/**
 *
 * @param newZone : La nouvelle zone à tester
 * @param zones : Tableau des zones. Chaque zone est un tablau de latlng
 * @param allees : Tableau des zones. Chaque zone est un tablau de latlng
 */
function geometryCheck(newZone, zones, allees) {

    var isValid = true;
    var message = "";

    // VAGUE DE TEST SUR LES ZONES
    _.each(zones, function (z) {
        // I - CONTENU DANS UNE AUTRE ZONE ?
        if (mapHelper.polygonContainsPolygon(newZone, z) || mapHelper.polygonContainsPolygon(z, newZone)) {
            isValid = false;
            message = Lang.get('administration_parking.carte.err_zone_contenue');
            return false; // Break the each
        }
        // II - CHEVAUCHE UNE AUTRE ZONE ?
        if (mapHelper.polygonIntersection(newZone, z)) {
            isValid = false;
            message = Lang.get('administration_parking.carte.err_zone_chevauche');
            return false; // Break the each
        }
    });

    // ON S'ÉPARGNE LES TESTS INUTILES
    if (isValid) {
        // VAGUE DE TEST SUR LES ALLÉES
        _.each(allees, function (a) {
            // III - CHEVAUCHE UNE ALLEE ?
            if (mapHelper.polygonIntersection(newZone, a)) {
                isValid = false;
                message = Lang.get('administration_parking.carte.err_allee_chevauche');
                return false; // Break the each
            }
            // IV - CONTENU DANS UNE AUTRE ZONE ?
            if (mapHelper.polygonContainsPolygon(a, newZone)) {
                isValid = false;
                message = Lang.get('administration_parking.carte.err_zone_contenue_allee');
                return false; // Break the each
            }
        });
    }

    if (!isValid) {
        swal(message);
    }
    return isValid;
}

/*****************************************************************************************************
 * VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
 * CRÉE UNE ZONE EN BDD EN FONCTION DES INORMATIONS DE LA POPUP.
 *
 * @param formDom : DOM du formulaire
 * @param zone : Zone à enregistrer (format layer Leaflet)
 * @param _inst : données d'instance du store
 *
 * @returns {boolean} état de l'insertion
 */
function createZone(formDom, zone, _inst) {
    console.log('Pass handleZone, zone : %o', zone);

    var alleesInZone = getAlleesInZone(formDom, zone, _inst);

    // Ya des allées
    if (alleesInZone.length > 0) {
        var placesInAllees = getAlleesInZone(formDom, zone, _inst);
    }
    // Ya pas d'allées
    else {
        // Récup des places dans la zone
        var placesInZone = getPlacesInZone(formDom, zone, _inst);

        // TODO Création allée par défaut de la zone
    }


    // TODO CONSTRUCTION DE l'AJAX DE CRÉATION
    var geoJson = zone.e.layer.toGeoJSON();
    var fData = formDataHelper('form_mod_zone', 'POST');
    fData.append('geojson', JSON.stringify(geoJson));

    return true;
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//******************************************************************************************************

/**
 * Retourne le tableau des allées contenues dans la zone
 * @param formDom : DOM du formulaire
 * @param zone : zone dessinnée par l'utilisateur (format layer Leaflet)
 * @param _inst : données d'instance du store
 */
function getAlleesInZone(formDom, zone, _inst) {
    var allAllees = mapHelper.getPolygonsArrayFromLeafletLayerGroup(_inst.mapInst.alleesGroup);

    var alleesInZone = mapHelper.getPolygonsContainedInPolygon(zone.e.layer, allAllees);
    console.log('Allées dans la zone : %o', alleesInZone);
    return alleesInZone;
}

/**
 * TODO : retourne le tableau des places contenues dans la zone par leur centre (Marker)
 *
 */
function getPlacesInZone(formDom, zone, _inst) {
    // Places de la carte
    var allPlaces = _.map(_inst.mapInst.placesMarkersGroup._layers, function(p){
        if (p._latlng == undefined) {
            console.error('Marker sans coordonnées ??? %o', p);
        } else {
            return p;
        }
    });

    console.log('AllPlaces = %o', allPlaces);

    var placesInZone = _.filter(allPlaces, function (place) {
        console.log('Place => %o', place);
        var isIn = mapHelper.isPointInPolygon(zone.e.layer._latlngs, place._latlng);
        return isIn;
    });

    console.log('Places in the zone = %o', placesInZone);

    return placesInZone;
}

/**
 * TODO : Tableau des places qui sont contenues dans les allées de la zone par leur centre (Marker)
 *
 */
function getPlacesInAllees(formDom, zone, _inst) {

}

/**
 * Interface publique du module
 */
module.exports = {
    geometryCheck: geometryCheck,
    createZone: createZone
};
