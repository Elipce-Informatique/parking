/**
 * Created by yann on 04/05/2015.
 */
var mapHelper = require('./map_helper');
var jh = require('./json_helper');
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
 * @param callback : function appellée lors du retour AJAX de l'insertion
 *
 */
function createZone(formDom, zone, _inst, callback) {

    var alleesInZone = getAlleesInZone(formDom, zone.e.layer, _inst);
    var geoJson = JSON.stringify(zone.e.layer._latlngs);

    // YA PAS D'ALLÉES --------------------------------------------------------------
    if (alleesInZone.alleesData.length == 0) {
        // Récup des places dans la zone
        var placesInZone = mapHelper.getPlacesInZone(zone, _inst);

        var data = {
            places_default: placesInZone,
            allees: [],
            zone_geojson: geoJson,
            plan_id: _inst.planInfos.id
        };

        // INSERTION DE LA ZONE
        insertZone(formDom, data, callback);
    }
    // YA DES ALLÉES --------------------------------------------------------------
    else {
        // RÉCUP DE TOUTES LES ALLÉES
        var alleesGeo = alleesInZone.alleesGeometrie;

        // PARCOURT DES ALLÉES POUR SORTIR LES PLACES
        var placesInAllees = [];
        _.each(alleesGeo, function (allee) {
            var placesInAllee = mapHelper.getPlacesInAllee(allee, _inst);
            placesInAllees = _.union(placesInAllees, placesInAllee);
        });

        // PLACES DANS LA ZONE
        var placesInZone = mapHelper.getPlacesInZone(zone, _inst);

        // TOUTES LES PLACES SONT DANS UNE ZONE PAS DE DEFAUT .....................
        if (placesInAllees.length == placesInZone.length) {

            var data = {
                places_default: [],
                allees: alleesInZone.alleesData,
                zone_geojson: geoJson,
                plan_id: _inst.planInfos.id
            };
            insertZone(formDom, data, callback);
        }
        // TOUTES LES PLACES NE SONT PAS DANS UNE ZONE .....................
        else {
            // PARCOURT DE TOUTES LES PLACES DE LA ZONE
            var placesDefault = _.filter(placesInZone, function (pz) {
                // Comparaison de la place avec les places dans les allées.
                // RETOURNE FALSE SI DANS L'ALLÉE
                return _.reduce(placesInAllees, function (isDefault, pa) {
                    var retour = isDefault ? !(pz.id == pa.id) : false;
                    return retour;
                }, true);
            });

            // CONSTRUCTION DES DONNÉES
            var data = {
                places_default: placesDefault,
                allees: alleesInZone.alleesData,
                zone_geojson: geoJson,
                plan_id: _inst.planInfos.id
            };

            // INSERTION DE LA ZONE
            insertZone(formDom, data, callback);
        }
    }
}

/**
 * Effectue l'appel AJAX pour insérer la zone en BDD en fonction des params
 * @param formDom
 * @param data
 * @param callback : function appellée lors du retour AJAX de l'insertion
 */
function insertZone(formDom, data, callback) {
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

/**
 * Retourne le tableau des allées présentes sur la map contenues dans la zone
 * @param formDom : DOM du formulaire
 * @param zone : zone dessinnée par l'utilisateur (format tableau de lat lng)
 * @param _inst : données d'instance du store
 */
function getAlleesInZone(formDom, zone, _inst) {
    var allAllees = mapHelper.getFeaturesArrayFromLeafletLayerGroup(_inst.mapInst.alleesGroup);

    // LES ALLÉES DE LA ZONE (OBJETS LEAFLET)
    var alleesInZone = _.filter(allAllees, function (allee) {
        return mapHelper.polygonContainsPolygon(zone._latlngs, allee._latlngs);
    });

    // EXTRACTION DE LA PROPRIÉTÉ DATA POUR ÉVITER LA REDONDANCE LIÉE À LA MAP.
    var alleesInZoneData = _.map(alleesInZone, function (allee) {
        return allee.options.data;
    });

    return {alleesData: alleesInZoneData, alleesGeometrie: alleesInZone};
}

/**
 * Crée les zones à afficher sur la map en fonction d'un tableau de places venant directement de la BDD
 *
 * @param zonesBDD : tableau d'objet de type zone sorti d'Eloquent.
 * @param zoneStyle : style à appliquer sur les zones
 * @returns : tableau de zones prêt pour le trigger vers la map
 */
function createZonesMapFromZonesBDD(zonesBDD, zoneStyle) {
    return _.map(zonesBDD, function (z) {
        if (z.geojson != "") {
            var extraData = z;
            var polygon = mapHelper.createFeatureFromCoordinates(JSON.parse(z.geojson), extraData, zoneStyle);
            polygon.bindLabel(z.libelle);

            return {
                data: z,
                polygon: polygon
            };
        } else {
            return null;
        }
    }, this);
}

/**
 * Retourne les options de contextMenu pour les allées en mode supervision
 * @returns {*[]}
 */
function supervisionContextMenu(e, context) {
    return [{
        text: '<b>' + e.layer.options.data.libelle + '</b>',
        index: 0
    }];
}

/**
 * Retourne les options de contextMenu pour les allées en mode administration
 * @returns {*[]}
 */
function administrationContextMenu(e, context) {
    return [{
        text: '<b>' + e.layer.options.data.libelle + '</b>',
        index: 0
    }, {
        separator: true,
        index: 1
    }, {
        text: Lang.get('global.modifier'),
        index: 2,
        callback: function (evt) {
            // LANCEMENT DU MODAL DE MODIF DE ALLEES
            var data = {
                layer: this.e.layer
            };
            var retour = {
                type: mapOptions.type_messages.edit_allee,
                data: data
            };
            this.storeContext.trigger(retour);
        }.bind({
                e: e,
                storeContext: context
            })
    }];
}

/**
 * Interface publique du module
 */
module.exports = {
    geometryCheck: geometryCheck,
    createZone: createZone,
    createZonesMapFromZonesBDD: createZonesMapFromZonesBDD,
    supervisionContextMenu: supervisionContextMenu,
    administrationContextMenu: administrationContextMenu,
    style: {
        color: '#daa520',
        weight: 2,
        opacity: 0.65,
        fillOpacity: 0.05,
        fillColor: '#daa520'
    }
};
