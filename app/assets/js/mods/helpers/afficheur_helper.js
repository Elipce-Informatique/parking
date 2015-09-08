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
    var htmlAfficheur = '<span class="html-afficheur" data-afficheur-wrapper data-toggle="tooltip" data-html="true"' +
        ' title="' +
        _.escape(htmlTooltip) +
        '">' + afficheur.data.defaut + '</span>';
    return htmlAfficheur;
}


/**
 * Retourne les options de contextMenu pour les afficheurs en mode supervision
 *
 * @returns {*[]}
 */
function supervisionContextMenu() {

    return [{
        name: 'Action',
        onClick: function () {
            // run when the action is clicked
        }
    }, {
        name: 'Another action',
        onClick: function () {
            // run when the action is clicked
        }
    }, {
        name: 'A third action',
        onClick: function () {
            // run when the action is clicked
        }
    }];
}

module.exports = {
    getCoordAfficheurFromPolyline: getCoordAfficheurFromPolyline,
    createAfficheursMapFromAfficheursBDD: createAfficheursMapFromAfficheursBDD,
    generateAfficheurLabel: generateAfficheurLabel,
    supervisionContextMenu: supervisionContextMenu,
    style: {
        color: '#000000',
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        fillColor: '#000000'
    }
};