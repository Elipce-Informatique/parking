/**
 * Created by yann on 04/05/2015.
 */
var _ = require('lodash');
var mapHelper = require('./map_helper');
var formDataHelper = require('./form_data_helper');

/**
 * Tests initiaux à la création d'une zone :
 * Chevauche une autre zone ?
 * - KO avec message
 * Chevauche une allée ?
 * - KO avec message
 * Contenue dans une autre zone ?
 * - KO avec message
 * Contenue dans une allée ?
 * - KO avec message
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
            // IV - CONTENU DANS UNE AUTRE ALLEE ?
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

    var alleesInZone = getAlleesInZone(formDom, zone, _inst);
    var geoJson = zone.e.layer.toGeoJSON();

    // YA PAS D'ALLÉES --------------------------------------------------------------
    if (alleesInZone.length == 0) {
        // Récup des places dans la zone
        var placesInZone = getPlacesInZone(formDom, zone, _inst);

        var data = {
            places_default: placesInZone,
            allees: [],
            zone_geojson: geoJson,
            plan_id: _inst.planInfos.id
        };

        // INSERTION DE LA ZONE
        insertZone(formDom, data);
    }
    // YA DES ALLÉES --------------------------------------------------------------
    else {
        // RÉCUP DE TOUTES LES ALLÉES
        var alleesInZone = getAlleesInZone(formDom, zone, _inst);

        // PARCOURT DES ALLÉES POUR SORTIR LES PLACES
        var placesInAllees = [];
        _.each(alleesInZone, function (allee) {
            var placesInAllee = getPlacesInAllee(formDom, allee, _inst);
            placesInAllees = _.union(placesInAllees, placesInAllee);
        });

        // PLACES DANS LA ZONE
        var placesInZone = getPlacesInZone(formDom, zone, _inst);

        // TOUTES LES PLACES SONT DANS UNE ZONE PAS DE DEFAUT .....................
        if (placesInAllees.length == placesInZone.length) {

            var data = {
                places_default: [],
                allees: alleesInZone,
                zone_geojson: geoJson,
                plan_id: _inst.planInfos.id
            };
            insertZone(formDom, data);
        }
        // TOUTES LES PLACES NE SONT PAS DANS UNE ZONE .....................
        else {
            // TODO : trouver les places à mettre dans l'allée par défaut.
        }
    }
    return true;
}

/**
 * Effectue l'appel AJAX pour insérer la zone en BDD en fonction des params
 * @param formDom
 * @param data
 */
function insertZone(formDom, data) {
    // CONSTRUCTION DE l'AJAX DE CRÉATION
    var fData = formDataHelper('form_mod_zone', 'POST');
    fData.append('data', JSON.stringify(data));

    $.ajax({
        type: 'POST',
        url: BASE_URI + 'parking/zone',
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

/**
 * TODO : tester
 * Retourne le tableau des allées présentes sur la map contenues dans la zone
 * @param formDom : DOM du formulaire
 * @param zone : zone dessinnée par l'utilisateur (format layer Leaflet)
 * @param _inst : données d'instance du store
 */
function getAlleesInZone(formDom, zone, _inst) {
    var allAllees = mapHelper.getPolygonsArrayFromLeafletLayerGroup(_inst.mapInst.alleesGroup);

    // Les allées de la zone (objets leaflet)
    var alleesInZone = _.filter(allAllees, function (allee) {
        return mapHelper.polygonContainsPolygon(zone, allee.e.layer);
    });

    // EXTRACTION DE LA PROPRIÉTÉ DATA POUR ÉVITER LA REDONDANCE LIÉE À LA MAP.
    alleesInZone = _.map(alleesInZone, function (allee) {
        return allee.options.data;
    });

    console.log('Allées dans la zone : %o', alleesInZone);
    return alleesInZone;
}

/**
 * retourne le tableau des places contenues dans la zone par leur centre (Marker)
 * Le tableau de retour contient la propriété options.data du marker pour éviter
 * la redondance circulaire lié à la map quand on le transforme en JSON.
 *
 * @param formDom : DOM du formulaire
 * @param zone : zone dessinnée par l'utilisateur (format layer Leaflet)
 * @param _inst : données d'instance du store
 */
function getPlacesInZone(formDom, zone, _inst) {
    // PLACES DE LA CARTE
    var allPlaces = getAllPlaces(_inst);

    // LISTE DES PLACES CONTENUES DANS LA ZONE
    var placesInZone = _.filter(allPlaces, function (place) {
        var isIn = mapHelper.isPointInPolygon(zone.e.layer._latlngs, place._latlng);
        return isIn;
    });

    // EXTRACTION DE LA PROPRIÉTÉ DATA POUR ÉVITER LA REDONDANCE LIÉE À LA MAP.
    placesInZone = _.map(placesInZone, function (place) {
        return place.options.data;
    });

    return placesInZone;
}

/**
 * TODO : tester
 *
 * @param formDom : DOM du formulaire
 * @param allee : allee à tester (format layer Leaflet)
 * @param _inst : données d'instance du store
 */
function getPlacesInAllee(formDom, allee, _inst) {
    // TOUTES LES PLACES DE LA CARTE
    var allPlaces = getAllPlaces(_inst);

    // LISTE DES PLACES CONTENUES DANS L'ALLÉE
    var placesInAllee = _.filter(allPlaces, function (place) {
        var isIn = mapHelper.isPointInPolygon(allee.e.layer._latlngs, place._latlng);
        return isIn;
    });

    // EXTRACTION DE LA PROPRIÉTÉ DATA POUR ÉVITER LA REDONDANCE LIÉE À LA MAP.
    placesInAllee = _.map(placesInAllee, function (place) {
        return place.options.data;
    });

    return placesInAllee;
}

/**
 * Retourne un tableau de marker de toutes les places présentes sur la carte
 * @param _inst
 * @returns {Array|*}
 */
function getAllPlaces(_inst) {
    // PLACES DE LA CARTE
    return _.map(_inst.mapInst.placesMarkersGroup._layers, function (p) {
        if (p._latlng == undefined) {
            console.error('Marker sans coordonnées ??? %o', p);
        } else {
            return p;
        }
    });
}

/**
 * Interface publique du module
 */
module.exports = {
    geometryCheck: geometryCheck,
    createZone: createZone
};
