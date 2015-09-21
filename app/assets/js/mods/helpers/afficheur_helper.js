var mapHelper = require('./map_helper');
/**
 * Retourne le dernier point du polyline tracé.
 * Ce point servira à placer le marker de l'afficheur.
 * @param poly : polyline obtenu par le plugin draw
 * @returns {*} : la dernière coordonnée de la ligne
 */
function getCoordAfficheurFromPolyline(poly) {
    var latlngs = poly._latlngs;

    return _.last(latlngs);
}

/**
 * Génère les données nécessaire à l'affichage des afficheurs sur la carte
 * @param afficheursBDD
 * @param afficheursStyle
 * @returns {*}
 */
function createAfficheursMapFromAfficheursBDD(afficheursBDD) {

    // Loop over the displays and generate an array of polyline + data objects
    var afficheursMap = _.map(afficheursBDD, function (a) {

        //console.log('Afficheur à traiter : %o', a);
        // 1 CRÉATION DU MARKER
        // pas besoin, il est créé directement au niveau de la map

        // 2 CRÉATION DU POLYLINE SI BESOIN
        var polyline = {};
        if (a.ligne != null && a.ligne != 'null') {
            var ligne = JSON.parse(a.ligne);
            //console.log('ligne : %o', ligne);
            polyline = mapHelper.createPolylineFromCoordinates(ligne, a, {
                color: '#000000',
                weight: 1,
                opacity: 1,
                fillOpacity: 1,
                fillColor: '#000000'
            });
        }

        // 3 GÉNÉRATION DES DONNEES POUR L'AFFICHEUR
        var data = {
            libelle: a.reference,
            lat: a.lat,
            lng: a.lng,
            defaut: "0000",
            vues_bis: {},
            id: a.id
        };

        // 4 EXTRACTION DES VALEURS PAR VUES (types de places)
        _.each(a.vues, function (vue) {
            // On est sur la vue "générique" à afficher sur la supervision
            if (vue.type_place != null && vue.type_place.defaut === "1") {
                var libres = (isNaN(vue.libres) ? Lang.get('global.' + vue.libres).toUpperCase() : vue.libres);
                data.defaut = _.padLeft(libres.toString(), 4, '0');
            }
            // Vue type <> générique
            else if (vue.type_place != null) {

                // Complet, libre ou nombre
                var libres = (isNaN(vue.libres) ? Lang.get('global.' + vue.libres).toUpperCase() : vue.libres);

                // Construction de la ligne d'information
                data.vues_bis[vue.cellNr.toString()] = {
                    libres: libres,
                    libelle: vue.type_place.libelle,
                    couleur: vue.type_place.couleur
                };
            }
        });

        // 5 STRUCTURATION DU RETOUR
        return {
            data: data,
            polyline: polyline
        }
    });

    return afficheursMap;
}

/**
 * retourne le tableau des places contenues dans la zone par leur centre (Marker)
 *
 *
 * @param zone : zone dessinnée par l'utilisateur (format layer Leaflet)
 * @param _inst : données d'instance du store
 *
 * @return: false si pas de capteur dans la sélection, {
            allPlaces: places,
            capteurPlaces: capteurPlaces
        } sinon
 */
function getPlacesInAfficheur(zone, _inst) {
    var places = mapHelper.getPlacesInZone(zone, _inst);

    var capteurPlaces = _.filter(places, function (p) {
        return p.capteur != null;
    });

    if (capteurPlaces.length) {
        return {
            allPlaces: places,
            capteurPlaces: capteurPlaces
        };
    } else {
        swal(Lang.get('administration_parking.carte.err_places_sans_capteur'));
        return false;
    }
}

/**
 * Génère le html nécessaire à l'affichage d'un afficheur
 * et de son tooltip en superbvision.
 *
 * @param afficheur : Afficheur à générer, c'est un objet avec la clé data
 *                      (récupéré dans le store supervision)
 * @returns {string} : le html à mettre dans le label du marker
 */
function generateAfficheurLabel(afficheur) {
    // GÉNÉRATION DU TOOLTIP
    var htmlTooltip = '<table>' + _.reduce(afficheur.data.vues_bis, function (str, vue) {
            return str + '<tr>' +
                '<td class="afficheur-libelle" style="color:#' + vue.couleur + ';text-align:left;margin-right:3px;">' +
                vue.libelle +
                '</td><td style="text-align:right;padding-left:5px"> ' +
                vue.libres +
                '</td>' +
                '</tr>';
        }, "", this) + '</table>';

    // GÉNÉRATION DU CONTENU DU LABEL
    var htmlAfficheur = '<span class="html-afficheur" data-afficheur-wrapper data-afficheur="' + _.escape(JSON.stringify(afficheur.data)) +
        '" data-toggle="tooltip" data-html="true" title="' +
        _.escape(htmlTooltip) +
        '">' + afficheur.data.defaut + '</span>';
    return htmlAfficheur;
}

/**
 * Prépare les données à envoyer au serveur
 * @param places : object - Les places au format comme renvoyées par la fonction getPlacesInAfficheur.
 */
function prepareCountersData(places, afficheur) {
    var placesWithCapteur = places.capteurPlaces;
    var groupedByTypePlace = {};

    _.each(placesWithCapteur, function (p) {
        typeof groupedByTypePlace[p.type_place_id] === 'undefined' ? groupedByTypePlace[p.type_place_id] = [] : null;
        groupedByTypePlace[p.type_place_id].push(p.capteur);
    }, this);

    console.log('Groupé par type : %o', groupedByTypePlace);
    // CRÉATION DES COUNTERS (type_place, libelle afficheur, capteurs)
    var counters = _.map(groupedByTypePlace, function (capteurGroup, type_place) {

        // Séparation des ids
        var capteurs_ids = _.map(capteurGroup, function (capteur) {
            // Parcourt des places pour retourner les id
            return capteur.id;
        }, this);

        return {
            libelle: afficheur.reference,
            type_place: type_place,
            capteurs_ids: capteurs_ids
        };
    }, this);
    return counters;
}


/**
 * Retourne les options de contextMenu pour les afficheurs en mode supervision
 * @returns {*[]} un tableau d'options de menu
 */
function supervisionContextMenu() {
    return [{
        name: Lang.get('supervision.commandes.changer_signalisation'),
        onClick: function (data) {
            // run when the action is clicked
            swal({
                html: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: Lang.get('global.annuler'),
                title: Lang.get('supervision.commandes.placeholder'),
                text: '<div id="circularG"> <div id="circularG_1" class="circularG"></div><div id="circularG_2" class="circularG"></div><div id="circularG_3" class="circularG"></div><div id="circularG_4" class="circularG"></div><div id="circularG_5" class="circularG"></div><div id="circularG_6" class="circularG"></div><div id="circularG_7" class="circularG"></div><div id="circularG_8" class="circularG"></div></div>'
            });
        }
    }, {
        name: Lang.get('supervision.commandes.changer_compteur'),
        onClick: function (data) {
            // run when the action is clicked
            swal({
                html: true,
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: Lang.get('global.annuler'),
                title: Lang.get('supervision.commandes.placeholder'),
                text: '<div id="circularG"> <div id="circularG_1" class="circularG"></div><div id="circularG_2" class="circularG"></div><div id="circularG_3" class="circularG"></div><div id="circularG_4" class="circularG"></div><div id="circularG_5" class="circularG"></div><div id="circularG_6" class="circularG"></div><div id="circularG_7" class="circularG"></div><div id="circularG_8" class="circularG"></div></div>'
            });
        }
    }];
}

module.exports = {
    getCoordAfficheurFromPolyline: getCoordAfficheurFromPolyline,
    createAfficheursMapFromAfficheursBDD: createAfficheursMapFromAfficheursBDD,
    getPlacesInAfficheur: getPlacesInAfficheur,
    generateAfficheurLabel: generateAfficheurLabel,
    supervisionContextMenu: supervisionContextMenu,
    prepareCountersData: prepareCountersData,
    style: {
        color: '#000000',
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        fillColor: '#000000'
    }
};