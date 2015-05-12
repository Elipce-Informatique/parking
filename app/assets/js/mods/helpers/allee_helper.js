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

module.exports = {
    geometryCheck: geometryCheck
};
