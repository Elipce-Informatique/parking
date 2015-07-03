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

function createAfficheursMapFromAfficheursBDD(afficheursBDD, afficheursStyle) {

    var afficheursMap = _.map(afficheursBDD, function (a) {

        console.log('Afficheur à traiter : %o', a);
        // 1 CRÉATION DU MARKER
        // pas besoin, il est créé directement au niveau de la map

        // 2 CRÉATION DU POLYLINE SI BESOIN
        var polyline = {};
        if (a.ligne != "null") {
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
        // 3 STRUCTURATION DU RETOUR
        return {
            data: a,
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