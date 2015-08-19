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
function createAfficheursMapFromAfficheursBDD(afficheursBDD, afficheursStyle) {

    // Loop over the displays and generate an array of polyline + data objects
    var afficheursMap = _.map(afficheursBDD, function (a) {

        console.log('Afficheur à traiter : %o', a);
        // 1 CRÉATION DU MARKER
        // pas besoin, il est créé directement au niveau de la map

        // 2 CRÉATION DU POLYLINE SI BESOIN
        var polyline = {};
        if (a.ligne != null && a.ligne != 'null') {
            var ligne = JSON.parse(a.ligne);
            console.log('ligne : %o', ligne);
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
            if (vue.type_place.defaut === "1") {
                data.defaut = vue.total.toString();
            } else {
                data.vues_bis[vue.cellNr.toString()] = vue.total;
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


module.exports = {
    getCoordAfficheurFromPolyline: getCoordAfficheurFromPolyline,
    createAfficheursMapFromAfficheursBDD: createAfficheursMapFromAfficheursBDD,
    style: {
        color: '#000000',
        weight: 1,
        opacity: 1,
        fillOpacity: 1,
        fillColor: '#000000'
    }
};